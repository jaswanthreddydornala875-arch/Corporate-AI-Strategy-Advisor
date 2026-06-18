import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import bgImage1 from "../assets/download.jpg";
import "./ChatBot.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmt$ = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n) => (n * 100).toFixed(1) + "%";
const readinessColor = (v) => (v >= 70 ? "#16a34a" : v >= 40 ? "#ca8a04" : "#dc2626");
const riskBadgeClass = (r) => (r === "Low" ? "cb-badge-green" : r === "Medium" ? "cb-badge-yellow" : "cb-badge-red");
const verdictBadgeClass = (v) => (v === "Recommended" ? "cb-badge-green" : v === "Not Recommended" ? "cb-badge-red" : "cb-badge-yellow");
const circumference = 2 * Math.PI * 42;

// ── Readiness Gauge ─────────────────────────────────────────────────────────
function Gauge({ value, label }) {
  const color = readinessColor(value);
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="cb-readiness-gauge">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" className="cb-readiness-gauge-bg" />
          <circle cx="50" cy="50" r="42" className="cb-readiness-gauge-fill"
            stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="cb-readiness-gauge-text" style={{ color }}>{value}</div>
      </div>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </div>
  );
}

// ── Narrative Renderer ──────────────────────────────────────────────────────
function Narrative({ text }) {
  if (!text) return null;
  const sections = text.split(/(?=^## )/m);
  return (
    <div className="cb-narrative">
      {sections.map((s, i) => {
        const lines = s.trim().split("\n");
        return (
          <div key={i}>
            {lines.map((line, j) => {
              if (line.startsWith("## ")) return <h2 key={j}>{line.slice(3)}</h2>;
              if (line.startsWith("- ")) return <ul key={j}><li>{line.slice(2)}</li></ul>;
              if (line.trim()) return <p key={j}>{line}</p>;
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Report Dashboard ────────────────────────────────────────────────────────
function ReportDashboard({ report }) {
  const { ml_results: ml, readiness: rd, business_need: bn, vendor_alignment: va, roadmap: rm, shap } = report;

  return (
    <div className="space-y-8">
      {/* ML Metrics */}
      <div className="cb-report-section" style={{ animationDelay: "0.05s" }}>
        <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-blue-500/20 text-blue-600">📊</span>Key Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="cb-metric-card">
            <div className="cb-metric-value">{fmtPct(ml.productivity_gain)}</div>
            <div className="cb-metric-label">Productivity Gain</div>
          </div>
          <div className="cb-metric-card">
            <div className="cb-metric-value text-emerald-500" style={{ WebkitTextFillColor: "unset", background: "none" }}>{fmt$(ml.cost_savings)}</div>
            <div className="cb-metric-label">Cost Savings</div>
          </div>
          <div className="cb-metric-card">
            <div className="cb-metric-value">{fmt$(ml.revenue_impact)}</div>
            <div className="cb-metric-label">Revenue Impact</div>
          </div>
          <div className="cb-metric-card">
            <div className="cb-metric-value" style={{ WebkitTextFillColor: "unset", background: "none", color: ml.roi_percentage >= 0 ? "#16a34a" : "#dc2626" }}>
              {ml.roi_percentage}%
            </div>
            <div className="cb-metric-label">ROI</div>
          </div>
          <div className="cb-metric-card flex flex-col items-center justify-center">
            <span className={`cb-risk-badge ${riskBadgeClass(ml.risk_level)}`}>⚠ {ml.risk_level} Risk</span>
          </div>
        </div>
      </div>

      {/* Readiness */}
      <div className="cb-report-section" style={{ animationDelay: "0.15s" }}>
        <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-indigo-500/20 text-indigo-600">🎯</span>AI Readiness</h3>
        <div className="cb-section-card">
          <div className="flex flex-wrap justify-around gap-6 py-2">
            <Gauge value={rd.overall_readiness} label="Overall" />
            <Gauge value={rd.data_readiness.overall} label="Data" />
            <Gauge value={rd.org_readiness.overall} label="Organization" />
            <Gauge value={rd.tech_readiness.overall} label="Technology" />
          </div>
        </div>
      </div>

      {/* Business Need */}
      <div className="cb-report-section" style={{ animationDelay: "0.25s" }}>
        <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-emerald-500/20 text-emerald-600">💡</span>Business Need</h3>
        <div className="cb-section-card space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">AI Justified:</span>
            <span className={`cb-badge ${bn.ai_justified ? "cb-badge-green" : "cb-badge-red"}`}>{bn.ai_justified ? "✓ Yes" : "✕ No"}</span>
          </div>
          <p className="text-sm text-gray-600">{bn.justification}</p>
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">Highest Impact Use Case</div>
              <div className="text-sm font-medium text-gray-800">{bn.highest_impact_use_case}</div>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">Recommended Starting Point</div>
              <div className="text-sm font-medium text-gray-800">{bn.recommended_starting_point}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Alignment */}
      {va && va.vendor_provided && (
        <div className="cb-report-section" style={{ animationDelay: "0.35s" }}>
          <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-amber-500/20 text-amber-600">🤝</span>Vendor Alignment</h3>
          <div className="cb-section-card space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-gray-800">{va.alignment_score}<span className="text-sm font-normal text-gray-500">/100</span></span>
              <span className={`cb-badge ${verdictBadgeClass(va.verdict)}`}>{va.verdict}</span>
            </div>
            <p className="text-sm text-gray-600">{va.reasoning}</p>
            {va.risks?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">Risks</div>
                <ul className="space-y-1">
                  {va.risks.map((r, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roadmap */}
      {rm && (
        <div className="cb-report-section" style={{ animationDelay: "0.45s" }}>
          <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-purple-500/20 text-purple-600">🗺️</span>Roadmap</h3>
          {rm.quick_win && (
            <div className="cb-quick-win mb-4 flex items-start gap-2">
              <span className="text-lg">⚡</span>
              <div><div className="text-xs font-bold text-blue-600 mb-0.5">QUICK WIN</div><p className="text-sm text-gray-700">{rm.quick_win}</p></div>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {[rm.phase_1, rm.phase_2, rm.phase_3].filter(Boolean).map((phase, i) => (
              <div key={i} className="cb-roadmap-card">
                <div className="text-xs font-bold text-blue-500 mb-1">{phase.duration}</div>
                <div className="text-sm font-bold text-gray-800 mb-2">{phase.title}</div>
                <ul className="space-y-1 mb-3">
                  {phase.actions?.map((a, j) => <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-blue-400">→</span>{a}</li>)}
                </ul>
                <div className="text-xs text-gray-500 border-t border-white/30 pt-2"><span className="font-semibold">Success:</span> {phase.success_metric}</div>
              </div>
            ))}
          </div>
          {rm.critical_dependencies?.length > 0 && (
            <div className="mt-3 text-xs text-gray-500"><span className="font-semibold">Critical Dependencies:</span> {rm.critical_dependencies.join(", ")}</div>
          )}
        </div>
      )}

      {/* SHAP Drivers */}
      {shap && (
        <div className="cb-report-section" style={{ animationDelay: "0.55s" }}>
          <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-pink-500/20 text-pink-600">🔬</span>Key Drivers (SHAP)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Productivity", drivers: shap.productivity_drivers },
              { label: "Savings", drivers: shap.savings_drivers },
              { label: "Revenue", drivers: shap.revenue_drivers },
            ].map(({ label, drivers }) => {
              const top = drivers?.[0];
              if (!top) return null;
              return (
                <div key={label} className="cb-shap-card">
                  <div className="text-xs font-bold text-gray-500 mb-2">{label} Top Driver</div>
                  <div className="text-sm font-semibold text-gray-800">{top.label}</div>
                  <div className={`text-lg font-bold mt-1 ${top.direction === "positive" ? "text-emerald-500" : "text-red-500"}`}>
                    {top.direction === "positive" ? "↑" : "↓"} {Math.abs(top.shap_value).toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Narrative */}
      <div className="cb-report-section" style={{ animationDelay: "0.65s" }}>
        <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-slate-500/20 text-slate-600">📝</span>Executive Narrative</h3>
        <Narrative text={report.narrative} />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN CHATBOT COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function ChatBot() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState("discovery"); // "discovery" | "report"
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const initRef = useRef(false);

  // ── Create session ──────────────────────────────────────────────────────
  const createSession = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/session/new`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSessionId(data.session_id);
      setMessages([{ role: "assistant", text: "Welcome to SIC AI Strategy Advisor. Please describe your organization and your AI goals to get started." }]);
      setPhase("discovery");
      setReport(null);
      setProgress(null);
    } catch {
      setMessages([{ role: "assistant", text: "Connection error. Please ensure the backend is running." }]);
    }
  }, []);

  useEffect(() => {
    if (!initRef.current) { initRef.current = true; createSession(); }
  }, [createSession]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // ── Send chat message ───────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !sessionId || isLoading) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInputText("");
    setIsLoading(true);

    // Decide endpoint based on phase
    if (phase === "report") {
      // Follow-up with streaming
      setMessages((m) => [...m, { role: "assistant", text: "" }]);
      try {
        const res = await fetch(`${BASE_URL}/followup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, question: text }),
        });
        if (!res.ok) throw new Error();
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMsg = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && !line.includes("[DONE]")) {
              assistantMsg += line.slice(6);
              const snapshot = assistantMsg;
              setMessages((m) => { const copy = [...m]; copy[copy.length - 1] = { role: "assistant", text: snapshot }; return copy; });
            }
          }
        }
      } catch {
        setMessages((m) => { const copy = [...m]; copy[copy.length - 1] = { role: "assistant", text: "Connection error. Please ensure the backend is running." }; return copy; });
      }
      setIsLoading(false);
      return;
    }

    // Discovery phase — POST /chat
    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data.type === "question") {
        setMessages((m) => [...m, { role: "assistant", text: data.message }]);
        if (data.progress) setProgress(data.progress);
      } else if (data.type === "report") {
        setReport(data.report);
        setPhase("report");
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Connection error. Please ensure the backend is running." }]);
    }
    setIsLoading(false);
  };

  // ── Key handler ─────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Sidebar nav ─────────────────────────────────────────────────────────
  const sidebarItems = ["Dashboard", "Assessment", "Reports", "History", "Settings"];

  const totalFields = progress ? (progress.ml_fields.total + progress.consulting_fields.total) : 28;
  const confirmedFields = progress ? (progress.ml_fields.confirmed + progress.consulting_fields.confirmed) : 0;
  const progressPct = totalFields > 0 ? (confirmedFields / totalFields) * 100 : 0;

  return (
    <div className="h-screen w-screen bg-cover bg-center flex" style={{ backgroundImage: `url(${bgImage1})` }}>
      <div className="cb-orb cb-orb-1" />
      <div className="cb-orb cb-orb-2" />

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div className="w-64 border-r border-gray-300 bg-white/20 backdrop-blur-md p-5 flex flex-col cb-sidebar">
        <h1 className="text-3xl font-bold text-blue-600 mb-10 cb-logo">SIC AI Advisor</h1>
        <div className="space-y-3">
          {sidebarItems.map((item, i) => (
            <button
              key={item}
              className={`cb-nav-btn w-full text-left p-3 rounded-lg hover:bg-white/30 transition ${
                ((item === "Dashboard" || item === "Assessment") && phase === "discovery") || 
                (item === "Reports" && phase === "report") ||
                (item === "History" && phase === "history") ||
                (item === "Settings" && phase === "settings") ? "cb-nav-active" : ""
              }`}
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              onClick={() => {
                if (item === "Reports" && report) setPhase("report");
                else if (item === "Dashboard" || item === "Assessment") setPhase("discovery");
                else if (item === "History") setPhase("history");
                else if (item === "Settings") setPhase("settings");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => { createSession(); }}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl cb-assess-btn text-sm font-semibold"
        >
          + New Assessment
        </button>
        <div className="mt-auto bg-white/40 backdrop-blur-md p-4 rounded-xl cb-user-card">
          <h3 className="font-semibold">Corporate User</h3>
          <p className="text-sm text-gray-700">admin@company.com</p>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center cb-topbar mb-4">
          <h2 className="text-2xl font-bold">{phase === "report" ? "Strategy Report" : "Corporate AI Strategy Advisor"}</h2>
          <div className="flex items-center gap-3">
            <Link to="/">
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all duration-200 cb-back-btn text-sm">← Home</button>
            </Link>
            {phase === "report" && (
              <button onClick={() => setPhase("discovery")} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl cb-view-toggle text-sm font-semibold">
                💬 Chat History
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar (discovery only) */}
        {phase === "discovery" && progress && (
          <div className="cb-progress-container mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-600">Discovery Progress</span>
              <span className="text-xs font-bold text-blue-600">{confirmedFields}/{totalFields} fields collected</span>
            </div>
            <div className="cb-progress-bar-track">
              <div className="cb-progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* ── DISCOVERY PHASE: Chat ──────────────────────────────────────── */}
        {phase === "discovery" && (
          <>
            <div className="cb-messages-area flex-1 min-h-0">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`cb-message ${msg.role === "user" ? "cb-message-user" : "cb-message-assistant"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="cb-message cb-message-assistant cb-loading-dots">
                      <div className="cb-loading-dot" /><div className="cb-loading-dot" /><div className="cb-loading-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="max-w-4xl mx-auto w-full mt-4">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-2xl cb-prompt-box">
                <textarea
                  ref={textareaRef}
                  rows="2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your business challenge..."
                  className="w-full bg-transparent resize-none outline-none text-base placeholder-gray-600"
                />
                <div className="flex justify-end mt-2">
                  <button disabled={isLoading || !inputText.trim()} onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl cb-send-btn text-sm font-semibold">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── REPORT PHASE ───────────────────────────────────────────────── */}
        {phase === "report" && report && (
          <div className="cb-report-area flex-1 min-h-0">
            <div className="max-w-5xl mx-auto">
              <ReportDashboard report={report} />

              {/* Post-report follow-up chat */}
              <div className="mt-8 cb-report-section" style={{ animationDelay: "0.75s" }}>
                <h3 className="cb-report-heading"><span className="cb-report-heading-icon bg-blue-500/20 text-blue-600">💬</span>Follow-up Questions</h3>

                {/* Show any follow-up messages */}
                {messages.filter((_, i) => i > 0).length > 0 && (
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {messages.slice(1).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`cb-message ${msg.role === "user" ? "cb-message-user" : "cb-message-assistant"}`} style={{ maxWidth: "80%" }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl cb-prompt-box">
                  <textarea
                    ref={textareaRef}
                    rows="2"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question about the report..."
                    className="w-full bg-transparent resize-none outline-none text-sm placeholder-gray-600"
                  />
                  <div className="flex justify-end mt-2">
                    <button disabled={isLoading || !inputText.trim()} onClick={handleSend}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl cb-send-btn text-sm font-semibold">
                      {isLoading ? "Streaming..." : "Ask"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY PHASE ──────────────────────────────────────────────── */}
        {phase === "history" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4 text-gray-400">🕒</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No History Yet</h3>
            <p className="text-gray-500 text-sm max-w-md text-center">
              You haven't completed any assessments in this session. Start a new assessment to see your history here.
            </p>
          </div>
        )}

        {/* ── SETTINGS PHASE ─────────────────────────────────────────────── */}
        {phase === "settings" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-8 shadow-xl max-w-lg w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">User Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                    <option>System Default</option>
                    <option>Light Mode</option>
                    <option>Dark Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Export Format</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none">
                    <option>PDF (Default)</option>
                    <option>CSV</option>
                    <option>JSON</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white font-bold py-3 mt-8 rounded-xl shadow hover:bg-blue-700 transition">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}