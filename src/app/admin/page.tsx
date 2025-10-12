export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  console.log('[Admin Page] Rendering admin dashboard - AUTH DISABLED')

  return (
    <html>
      <head>
        <title>Admin Dashboard</title>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
              ✓ Admin Dashboard
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem' }}>
              Authentication temporarily disabled for testing
            </p>
            <div style={{ marginBottom: '1rem' }}>
              {/* Client sign-out via server route */}
              <a
                href="/auth/signout"
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  color: '#334155',
                  background: '#ffffff',
                  textDecoration: 'none'
                }}
              >
                Sign out
              </a>
            </div>
            <div style={{
              marginTop: '2rem',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
            }}>
              <p style={{ fontSize: '1.125rem', color: '#10b981', fontWeight: '600' }}>
                ✓ You successfully accessed the admin panel!
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '1rem' }}>
                Route: /admin
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
