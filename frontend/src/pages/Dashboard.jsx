import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="h-20 flex items-center justify-between px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
        AI
      </div>
      <div>
        <h1 className="font-bold text-xl text-gray-900">SIC AI Advisor</h1>
      </div>
    </div>
    <ul className="hidden lg:flex gap-8 text-sm font-medium text-gray-600">
      <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
      <Link to="/features" className="hover:text-indigo-600 transition-colors">Features</Link>
      <Link to="/dashboard" className="text-indigo-600 font-semibold">Dashboard</Link>
      <Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
      <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
    </ul>
    <Link to="/login">
      <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition">
        Login
      </button>
    </Link>
  </nav>
);

export default function Dashboard() {
  const recentAssessments = [
    { id: "A-104", name: "Customer Support Automation", date: "Oct 12, 2026", status: "Completed", roi: "+24%", risk: "Low" },
    { id: "A-103", name: "Supply Chain Optimization", date: "Sep 28, 2026", status: "Completed", roi: "+18%", risk: "Medium" },
    { id: "A-102", name: "HR Onboarding Bot", date: "Sep 15, 2026", status: "In Progress", roi: "Pending", risk: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Corporate User</h1>
            <p className="text-gray-500">Here's an overview of your AI strategy initiatives.</p>
          </div>
          <Link to="/chatbot">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition flex items-center gap-2">
              <span>+</span> New Assessment
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">📊</div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Total Assessments</div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl">💰</div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Identified Savings</div>
              <div className="text-2xl font-bold text-emerald-600">$1.2M+</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">⚡</div>
            <div>
              <div className="text-sm text-gray-500 font-medium">Avg Productivity Gain</div>
              <div className="text-2xl font-bold text-purple-600">22%</div>
            </div>
          </div>
        </div>

        {/* Recent Assessments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Recent Assessments</h2>
            <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4 font-semibold">Initiative Name</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Est. ROI</th>
                  <th className="px-6 py-4 font-semibold">Risk Level</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentAssessments.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.roi}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        item.risk === 'Low' ? 'text-emerald-600' : item.risk === 'Medium' ? 'text-amber-600' : 'text-gray-400'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/chatbot">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                          {item.status === 'Completed' ? 'View Report' : 'Resume'}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
