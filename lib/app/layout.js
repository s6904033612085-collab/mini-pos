import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Mini POS - Drink House',
  description: 'ระบบ POS ร้านขายของขนาดเล็ก',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <strong style={{ color: '#00d4ff' }}>🥤 Drink House POS</strong>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>📦 รายการสินค้า</Link>
            <Link href="/sell" style={{ color: '#fff', textDecoration: 'none' }}>🛒 ขายสินค้า (POS)</Link>
            <Link href="/history" style={{ color: '#fff', textDecoration: 'none' }}>📜 ประวัติการขาย</Link>
          </div>
        </nav>
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
