import { Link } from "react-router-dom";
import bgImage1 from "../assets/download.jpg";
import "./ChatBot.css";

function ChatBot() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex"
      style={{ backgroundImage: `url(${bgImage1})` }}
    >
      {/* Floating orbs */}
      <div className="cb-orb cb-orb-1" />
      <div className="cb-orb cb-orb-2" />

      {/* Sidebar */}
      <div className="w-64 border-r border-gray-300 bg-white/20 backdrop-blur-md p-5 flex flex-col cb-sidebar">

        <h1 className="text-3xl font-bold text-blue-600 mb-10 cb-logo">
          SIC AI Advisor
        </h1>

        <div className="space-y-3">
          {["Dashboard", "Assessment", "Reports", "History", "Settings"].map((item, i) => (
            <button
              key={item}
              className="cb-nav-btn w-full text-left p-3 rounded-lg hover:bg-white/30 transition"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-auto bg-white/40 backdrop-blur-md p-4 rounded-xl cb-user-card">
          <h3 className="font-semibold">Corporate User</h3>
          <p className="text-sm text-gray-700">admin@company.com</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col">

        {/* Top Bar */}
        <div className="flex justify-between items-center cb-topbar">
          <h2 className="text-3xl font-bold">
            Corporate AI Strategy Advisor
          </h2>
          <div className="flex items-center gap-3">
            <Link to="/">
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl transition-all duration-200 cb-back-btn">
                ← Home
              </button>
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cb-assess-btn">
              New Assessment
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center">

          {/* Prompt Box */}
          <div className="w-full max-w-6xl mt-64">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl mt-44 cb-prompt-box">

              <textarea
                rows="6"
                placeholder="Describe your business challenge..."
                className="w-full h-7 bg-transparent resize-none outline-none text-lg placeholder-gray-600"
              />

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-3 flex-wrap" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl cb-send-btn">
                  Send
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ChatBot;