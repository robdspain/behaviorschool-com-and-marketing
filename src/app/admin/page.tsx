export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
        <p className="text-slate-600">Authentication temporarily disabled for testing</p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <p className="text-lg text-green-600">✓ You can access the admin panel!</p>
        </div>
      </div>
    </div>
  )
}
