import { Link } from "react-router-dom";
import bgImage from "../assets/download.jpg";

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
      <Link to="/features" className="text-indigo-600 font-semibold">Features</Link>
      <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
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

export default function Features() {
  const features = [
    {
      title: "Interactive AI Discovery",
      description: "Chat with our intelligent advisor to uncover specific business needs and map them to high-impact AI use cases.",
      icon: "💬"
    },
    {
      title: "ROI & Impact Prediction",
      description: "Get data-driven estimates on cost savings, productivity gains, and revenue growth using our advanced ML models.",
      icon: "📈"
    },
    {
      title: "Readiness Assessment",
      description: "Evaluate your organizational, technical, and data readiness to ensure a smooth AI adoption journey.",
      icon: "🎯"
    },
    {
      title: "Strategic Roadmap",
      description: "Receive a step-by-step implementation plan including quick wins, vendor alignment, and critical dependencies.",
      icon: "🗺️"
    },
    {
      title: "Risk Mitigation",
      description: "Identify potential risks and roadblocks early with actionable recommendations on how to address them.",
      icon: "🛡️"
    },
    {
      title: "Executive Reporting",
      description: "Generate comprehensive, beautifully formatted reports ready to be shared with stakeholders and leadership.",
      icon: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Powerful Features for <span className="text-indigo-600">Smart AI Strategy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything you need to analyze, plan, and execute your corporate AI adoption strategy with confidence. Built for leaders who demand measurable results.
          </p>
          <Link to="/chatbot">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all hover:-translate-y-1">
              Try the Advisor Now
            </button>
          </Link>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your business?</h2>
          <p className="text-indigo-200 mb-8">Join the leading companies making data-driven AI adoption decisions.</p>
          <Link to="/login">
            <button className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
