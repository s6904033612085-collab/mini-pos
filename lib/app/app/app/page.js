'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ sku: '', name: '', price: '', stock: '', unit: 'ขวด' })

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true })
    if (!error) setProducts(data)
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    if (!form.sku || !form.name || !form.price) return alert('กรุณากรอกข้อมูลให้ครบ')
    
    const { error } = await supabase.from('products').insert([{
      sku: form.sku,
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      unit: form.unit
    }])

    if (error) alert('เกิดข้อผิดพลาด: ' + error.message)
    else {
      setForm({ sku: '', name: '', price: '', stock: '', unit: 'ขวด' })
      fetchProducts()
    }
  }

  async function handleDelete(id) {
    if (!confirm('ยืนยันลบสินค้านี้?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div>
      <h2>📦 จัดการรายการสินค้า</h2>
      <form onSubmit={handleAddProduct} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>เพิ่มสินค้าใหม่</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr', gap: '0.5rem' }}>
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
          <input placeholder="ชื่อสินค้า" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="number" placeholder="ราคา" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input type="number" placeholder="สต๊อก" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input placeholder="หน่วย" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
        </div>
        <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>+ เพิ่มสินค้า</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>คงเหลือ</th>
            <th>หน่วย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price} ฿</td>
              <td style={{ color: p.stock <= 5 ? 'red' : 'inherit', fontWeight: p.stock <= 5 ? 'bold' : 'normal' }}>{p.stock}</td>
              <td>{p.unit}</td>
              <td><button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>ลบ</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
