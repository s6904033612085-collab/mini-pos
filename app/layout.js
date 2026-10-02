import Link from 'next/link'

export const metadata = {
  title: 'Mini POS System',
  description: 'ระบบ Mini POS เช็คสต๊อกและแจ้งเตือนผ่าน Telegram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '20px', backgroundColor: '#f4f6f8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>🏪 Mini POS System</h1>
            <nav style={{ display: 'flex', gap: '15px' }}>
              <Link href="/" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>📦 รายการสินค้า</Link>
              <Link href="/sell" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>🛒 ขายสินค้า (POS)</Link>
              <Link href="/history" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>📜 ประวัติการขาย</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
