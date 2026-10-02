'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SellPage() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) setProducts(data)
  }

  const selectedProduct = products.find(p => p.id === selectedProductId)
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0

  // ฟังก์ชันยิงแจ้งเตือนเข้า Telegram API
  async function sendTelegramNotification(productName, qty, total, remainingStock) {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.warn('Telegram Token หรือ Chat ID ไม่ครบถ้วน')
      return
    }

    const now = new Date().toLocaleString('th-TH')

    // 1. ข้อความรายการขายใหม่
    const orderMsg = `🛍️ <b>มีรายการขายใหม่! (Drink House)</b>\n` +
      `- <b>สินค้า:</b> ${productName}\n` +
      `- <b>จำนวน:</b> ${qty} ชิ้น\n` +
      `- <b>ราคารวม:</b> ${total.toLocaleString()} บาท\n` +
      `- <b>สต๊อกคงเหลือ:</b> ${remainingStock} ชิ้น\n` +
      `- <b>เวลา:</b> ${now}`

    try {
      // ยิงแจ้งเตือนออเดอร์ขาย
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: orderMsg, parse_mode: 'HTML' })
      })

      // 2. ถ้าสต๊อกเหลือน้อยกว่าหรือเท่ากับ 5 ให้ยิงเตือนภัยเพิ่มอีก 1 ข้อความ
      if (remainingStock <= 5) {
        const lowStockMsg = `🚨 <b>[เตือนภัย] สต๊อกสินค้าใกล้หมด!</b>\n` +
          `- <b>สินค้า:</b> ${productName}\n` +
          `- <b>คงเหลือเพียง:</b> ${remainingStock} ชิ้น\n` +
          `⚠️ <i>กรุณาเติมสต๊อกสินค้าด่วน!</i>`

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: lowStockMsg, parse_mode: 'HTML' })
        })
      }
    } catch (err) {
      console.error('Failed to send Telegram notification:', err)
    }
  }

  async function handleSell(e) {
    e.preventDefault()
    if (!selectedProduct) return alert('กรุณาเลือกสินค้า')
    if (quantity <= 0) return alert('จำนวนต้องมากกว่า 0')
    if (selectedProduct.stock < quantity) return alert(`สต๊อกไม่พอ! คงเหลือเพียง ${selectedProduct.stock} ชิ้น`)

    setLoading(true)
    const newStock = selectedProduct.stock - quantity

    // 1. บันทึกรายการขาย
    const { error: saleErr } = await supabase.from('sales').insert([{
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: parseInt(quantity),
      total_price: totalPrice
    }])

    if (saleErr) {
      alert('บันทึกการขายล้มเหลว: ' + saleErr.message)
      setLoading(false)
      return
    }

    // 2. ตัดสต๊อกสินค้า
    const { error: stockErr } = await supabase.from('products').update({ stock: newStock }).eq('id', selectedProduct.id)

    if (stockErr) {
      alert('ตัดสต๊อกล้มเหลว: ' + stockErr.message)
    } else {
      alert('ขายสำเร็จ!')
      // 3. ยิง Telegram Notification
      await sendTelegramNotification(selectedProduct.name, quantity, totalPrice, newStock)
      
      setSelectedProductId('')
      setQuantity(1)
      fetchProducts()
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>🛒 ขายสินค้า (POS)</h2>
      <form onSubmit={handleSell}>
        <div style={{ marginBottom: '1rem' }}>
          <label>เลือกสินค้า:</label>
          <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} required>
            <option value="">-- เลือกรายการสินค้า --</option>
            {products.map(p => (
              <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                {p.name} - {p.price} ฿ (คงเหลือ: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>จำนวน:</label>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} required />
        </div>

        <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#0070f3' }}>ราคารวมทั้งสิ้น: {totalPrice.toLocaleString()} บาท</h3>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem' }}>
          {loading ? 'กำลังบันทึก...' : '✅ ยืนยันการขาย'}
        </button>
      </form>
    </div>
  )
}
