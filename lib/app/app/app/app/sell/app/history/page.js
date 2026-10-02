'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function HistoryPage() {
  const [sales, setSales] = useState([])

  useEffect(() => { fetchSales() }, [])

  async function fetchSales() {
    const { data } = await supabase.from('sales').select('*').order('sold_at', { ascending: false })
    if (data) setSales(data)
  }

  const grandTotal = sales.reduce((sum, s) => sum + Number(s.total_price), 0)

  return (
    <div>
      <h2>📜 ประวัติการขาย</h2>
      <div style={{ background: '#e6ffe6', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#28a745' }}>ยอดขายสะสมทั้งหมด: {grandTotal.toLocaleString()} บาท</h3>
      </div>

      <table>
        <thead>
          <tr>
            <th>วันเวลาที่ขาย</th>
            <th>ชื่อสินค้า</th>
            <th>จำนวน</th>
            <th>ยอดรวม (บาท)</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{new Date(s.sold_at).toLocaleString('th-TH')}</td>
              <td>{s.product_name}</td>
              <td>{s.quantity}</td>
              <td>{Number(s.total_price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
