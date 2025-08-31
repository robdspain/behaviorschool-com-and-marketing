export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          Achieve Your Goals with Clarity and Purpose
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          The Values-Based Goal Assistant helps you set meaningful goals aligned with what truly matters to you.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
          Start Your Journey
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Align with Values</h2>
          <p className="text-gray-600">Ensure your goals reflect your core values for lasting motivation.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Actionable Steps</h2>
          <p className="text-gray-600">Break down big goals into manageable, concrete actions.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Progress</h2>
          <p className="text-gray-600">Monitor your journey and celebrate milestones along the way.</p>
        </div>
      </section>
    </main>
  );
}