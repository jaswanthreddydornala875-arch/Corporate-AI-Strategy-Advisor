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
      <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
      <Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
      <Link to="/contact" className="text-indigo-600 font-semibold">Contact</Link>
    </ul>
    <Link to="/login">
      <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition">
        Login
      </button>
    </Link>
  </nav>
);

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about integrating AI into your business? Our team of experts is ready to help you navigate your strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Contact Info (Left Side) */}
          <div className="bg-indigo-600 text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-indigo-200 mb-10 leading-relaxed">
                Fill up the form and our team will get back to you within 24 hours. We're excited to hear about your AI goals!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center text-xl">📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center text-xl">✉️</span>
                  <span>hello@sicaidvisor.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center text-xl">📍</span>
                  <span>123 Strategy Way, Innovation Hub<br/>San Francisco, CA 94105</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-16">
              <div className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center hover:bg-white hover:text-indigo-600 cursor-pointer transition-colors">X</div>
              <div className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center hover:bg-white hover:text-indigo-600 cursor-pointer transition-colors">In</div>
              <div className="w-10 h-10 bg-indigo-500/50 rounded-full flex items-center justify-center hover:bg-white hover:text-indigo-600 cursor-pointer transition-colors">Gh</div>
            </div>
          </div>

          {/* Form (Right Side) */}
          <div className="p-10 md:p-14">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="john@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white">
                  <option>1-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-1000 employees</option>
                  <option>1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none" placeholder="Tell us about your AI adoption goals..."></textarea>
              </div>

              <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
