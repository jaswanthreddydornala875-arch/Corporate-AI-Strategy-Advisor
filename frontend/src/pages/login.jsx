import { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/download.jpg";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SmallLockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b4fe0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66"/>
  </svg>
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // handle login logic
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ── TOP NAV ── */}
      <div className="flex items-center gap-3 px-10 py-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-white">
            <BrainIcon />
          </div>
          <div>
            <p className="text-gray-900 text-[15px] font-semibold tracking-tight leading-none">SIC AI Advisor</p>
            <p className="text-gray-500 text-[11px] mt-0.5">AI Adoption &amp; ROI Strategy</p>
          </div>
        </Link>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex items-center justify-between px-10 lg:px-20 pb-10 gap-10">

        {/* ── LEFT HERO TEXT ── */}
        <div className="flex-1 max-w-[520px]">
          {/* Accent underline decoration */}
          <div className="flex gap-1 mb-6">
            <div className="h-[3px] w-8 rounded-full bg-[#4f35c8]" />
            <div className="h-[3px] w-3 rounded-full bg-[#a89af5]" />
          </div>

          <h1 className="text-gray-900 text-[46px] font-bold leading-[1.15] tracking-tight mb-5">
            Make Smarter AI<br />Decisions.<br />
            Drive{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f35c8 0%, #7c62e8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Measurable<br />Growth.
            </span>
          </h1>

          <p className="text-gray-500 text-[15px] leading-relaxed max-w-[380px]">
            We help you decide if, when, and where to invest in AI.
            Assess readiness, validate initiatives, and predict
            ROI with confidence.
          </p>
        </div>

        {/* ── RIGHT FORM CARD ── */}
        <div className="w-[400px] shrink-0 bg-white rounded-2xl shadow-2xl px-9 py-9">

          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-[#f0eeff] flex items-center justify-center text-[#6b4fe0]">
              <ShieldIcon />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">Welcome back</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Sign in to your account to continue</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                Email address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-4 py-3 text-[13px] border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#6b4fe0] focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-3 text-[13px] border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#6b4fe0] focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#6b4fe0] rounded"
                />
                <span className="text-[12px] text-gray-500">Remember me</span>
              </label>
              <a href="#" className="text-[12px] font-medium text-[#6b4fe0] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white tracking-wide transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #4f35c8 0%, #6b4fe0 100%)" }}
            >
              Login
              <ArrowRightIcon />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium bg-white hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            Sign in or continue with Google
          </button>

          {/* Sign up */}
          <p className="text-center text-[12px] text-gray-400 mt-5">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-[#6b4fe0] font-medium hover:underline">
              Sign up for free
            </a>
          </p>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <SmallLockIcon />
            <span className="text-[11px] text-gray-400">Your data is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
