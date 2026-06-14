import { Link } from "react-router-dom";
import blobVideo from "../assets/chatbot.mp4";
import logo from "../assets/insiders.jpg";
import bgImage from "../assets/download.jpg";
import "./Home.css";

function Home() {
  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Floating background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-16 py-10 animate-nav">
        <div className="flex items-center gap-3 logo-entrance">
          <div className="logo-spin-wrapper">
            <img
              src={logo}
              alt="AI Advisor Logo"
              className="w-12 h-12 object-contain rounded-3xl logo-img"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl">SIC AI Advisor</h1>
            <p className="text-xs text-gray-500">AI Adoption &amp; ROI Strategy</p>
          </div>
        </div>

        <ul className="hidden lg:flex gap-10 text-sm font-medium">
          {["Features", "How It Works", "Use Cases", "Dashboard", "About", "Resources"].map(
            (item, i) => (
              <li
                key={item}
                className="nav-item cursor-pointer hover:text-indigo-600 transition-colors relative"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {item}
                <span className="nav-underline" />
              </li>
            )
          )}
        </ul>

        <button className="login-btn bg-indigo-600 text-white px-6 py-3 rounded-xl">
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="badge-pill">
              ✦ AI ADOPTION READINESS &amp; ROI ADVISOR
            </span>

            <h1 className="text-6xl font-bold mt-8 leading-tight hero-heading">
              Make Smarter AI Decisions.
              <br />
              Drive{" "}
              <span className="text-indigo-600 shimmer-text">
                Measurable Growth.
              </span>
            </h1>

            <p className="mt-8 text-black font-serif text-lg ">
              We help you decide if, when, and where to invest in AI. Assess
              readiness, validate initiatives, and predict ROI with confidence.
            </p>

            <div className="flex items-center gap-4 mt-10 hero-buttons">
              <button className="roi-btn bg-indigo-600 text-white px-8 py-4 rounded-xl">
                Start ROI Analysis
              </button>

              {/* Chat Bot button with video */}
              <Link to="/chatbot">
                <div className="chatbot-btn flex items-center border rounded-xl bg-[#94adeb] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 cursor-pointer overflow-hidden pr-4">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-14 h-14 object-contain"
                    style={{ mixBlendMode: "multiply" }}
                  >
                    <source src={blobVideo} type="video/mp4" />
                  </video>
                  <span className="font-medium text-sm">Chat Bot</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
