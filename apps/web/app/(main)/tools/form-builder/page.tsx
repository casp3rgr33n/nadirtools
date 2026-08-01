"use client";

import React, { useState } from "react";
import AdUnit from "../../../../components/AdUnit";

const API = "https://api.nadirtools.com";

function FormBuilderEmbed() {
  const [tab, setTab] = useState<"create" | "embed">("create");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [forms, setForms] = useState<any[]>([]);
  const [embedCode, setEmbedCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const api = async (path: string, opts: RequestInit = {}) => {
    const r = await fetch(`${API}${path}`, {
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    });
    return r.json();
  };

  const register = async () => {
    if (!email || password.length < 6) { setStatus("Email and 6+ char password required"); return; }
    setLoading(true); setStatus("Creating account...");
    try {
      const d = await api("/api/register", { method: "POST", body: JSON.stringify({ email, password }) });
      if (d.api_key) { setApiKey(d.api_key); setStatus(`✅ Account created! Tier: ${d.tier}`); loadForms(d.api_key); }
      else setStatus(d.error || "Registration failed");
    } catch { setStatus("Connection error — check your internet"); }
    setLoading(false);
  };

  const loadForms = async (key: string) => {
    try { const d = await api("/api/forms", { headers: { "x-api-key": key } }); setForms(d.forms || []); }
    catch { setForms([]); }
  };

  const getEmbed = async (formId: string) => {
    try {
      const d = await api(`/api/forms/${formId}/embed`, { headers: { "x-api-key": apiKey } });
      setEmbedCode(d.embedCode || d.error || "Could not generate embed");
      setTab("embed");
    } catch { setStatus("Failed to get embed code"); }
  };

  const getInstant = async () => {
    setLoading(true);
    try { const d = await api("/api/instant-contact-form"); setEmbedCode(d.embedCode || "Failed"); setTab("embed"); }
    catch { setStatus("Could not generate instant form"); }
    setLoading(false);
  };

  const s = {
    input: { width: "100%", padding: "12px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9", fontSize: "16px", marginBottom: "10px", boxSizing: "border-box" } as React.CSSProperties,
    btn: { padding: "12px 20px", background: "#1f6feb", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: 600 } as React.CSSProperties,
    btnGreen: { padding: "12px 20px", background: "#238636", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: 600 } as React.CSSProperties,
    textarea: { width: "100%", minHeight: "150px", padding: "12px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9", fontFamily: "monospace", fontSize: "13px", boxSizing: "border-box" } as React.CSSProperties,
    card: { padding: "14px", background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" } as React.CSSProperties,
  };

  if (!apiKey) {
    return (
      <div style={{ padding: "24px 16px" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "20px", fontSize: "clamp(16px, 4vw, 20px)" }}>Create Your Free Account</h3>
        <p style={{ color: "#8b949e", fontSize: "14px", marginBottom: "20px" }}>3 forms, unlimited fields, instant embed. No credit card.</p>
        
        <input style={s.input} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <input style={s.input} type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <button style={s.btn} onClick={register} disabled={loading}>
            {loading ? "⏳ Creating..." : "Register Free"}
          </button>
          <button style={s.btnGreen} onClick={getInstant} disabled={loading}>
            ⚡ Instant Form (No Signup)
          </button>
        </div>

        {status && (
          <p style={{ color: status.startsWith("✅") ? "#3fb950" : status.includes("error") || status.includes("failed") ? "#f85149" : "#d2991d", marginTop: "12px", fontSize: "14px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>{status}</p>
        )}

        {embedCode && (
          <div style={{ marginTop: "20px", border: "1px solid #30363d", borderRadius: "8px", padding: "16px", background: "#0d1117" }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "10px" }}>Copy this HTML into your website:</p>
            <textarea readOnly value={embedCode} style={s.textarea} onClick={e => (e.target as HTMLTextAreaElement).select()} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #30363d", paddingBottom: "12px" }}>
        <button onClick={() => setTab("create")} style={{ ...s.btn, background: tab === "create" ? "#1f6feb" : "#21262d", fontSize: "14px", padding: "8px 14px" }}>
          📝 My Forms ({forms.length})
        </button>
        <button onClick={() => setTab("embed")} style={{ ...s.btn, background: tab === "embed" ? "#1f6feb" : "#21262d", fontSize: "14px", padding: "8px 14px" }}>
          🔗 Embed
        </button>
        <button onClick={getInstant} style={{ ...s.btnGreen, fontSize: "14px", padding: "8px 14px", marginLeft: "auto" }}>
          ⚡ Instant
        </button>
      </div>

      {tab === "create" && (
        <div>
          {forms.length === 0 && (
            <p style={{ color: "#8b949e", padding: "20px", textAlign: "center" }}>
              No forms yet. Click <strong>⚡ Instant</strong> for a one-click contact form, or use the API to create forms programmatically.
            </p>
          )}
          {forms.map((f: any) => (
            <div key={f.id} onClick={() => getEmbed(f.id)} style={s.card}>
              <span style={{ color: "#58a6ff", fontWeight: 500 }}>{f.title || "Untitled"}</span>
              <span style={{ color: "#8b949e", fontSize: "13px", marginLeft: "12px" }}>{f.fields?.length || 0} fields · Tap for embed</span>
            </div>
          ))}
        </div>
      )}

      {tab === "embed" && embedCode && (
        <div style={{ border: "1px solid #30363d", borderRadius: "8px", padding: "16px", background: "#0d1117" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "10px" }}>Paste this into your website's HTML:</p>
          <textarea readOnly value={embedCode} style={s.textarea} onClick={e => (e.target as HTMLTextAreaElement).select()} />
        </div>
      )}
      {tab === "embed" && !embedCode && (
        <p style={{ color: "#8b949e", textAlign: "center", padding: "20px" }}>Select a form above or click ⚡ Instant.</p>
      )}
    </div>
  );
}

export default function FormBuilderPage() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .fb-container { padding: 1rem 0.5rem !important; }
          .fb-hero h1 { font-size: 1.6rem !important; }
          .fb-hero p { font-size: 0.95rem !important; }
        }
        .fb-card * { box-sizing: border-box; }
        .fb-card input:focus { outline: none; border-color: #58a6ff !important; box-shadow: 0 0 0 2px rgba(31,111,235,0.15); }
        .fb-card button:active { transform: scale(0.98); }
      `}</style>
      <div className="fb-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", width: "100%" }}>
        <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          <a href="/" style={{ color: "#dfba6b", textDecoration: "none" }}>Home</a> / <span>Form Builder Pro</span>
        </nav>

        <div className="fb-hero" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "#f8fafc", margin: "0 0 0.5rem 0" }}>Form Builder Pro</h1>
          <p style={{ color: "#94a3b8", fontSize: "clamp(0.9rem, 3vw, 1.1rem)", lineHeight: "1.7" }}>
            Embeddable forms with custom CSS, CSRF tokens, and spam protection. Clean HTML — no iframes. Free: 3 forms + unlimited fields.
          </p>
        </div>

        <AdUnit adSlot="3456789012" />

        <div className="fb-card" style={{ border: "1px solid rgba(223, 186, 107, 0.15)", borderRadius: "12px", overflow: "hidden", margin: "2rem 0", background: "#0a0f0a" }}>
          <FormBuilderEmbed />
        </div>
      </div>
    </>
  );
}