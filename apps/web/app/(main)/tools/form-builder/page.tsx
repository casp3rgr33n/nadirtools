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

  const register = async () => {
    try {
      setStatus("Registering...");
      const r = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (d.api_key) {
        setApiKey(d.api_key);
        setStatus(`Registered! Tier: ${d.tier}`);
        loadForms(d.api_key);
      } else {
        setStatus(d.error || "Registration failed");
      }
    } catch {
      setStatus("Connection error — is the API online?");
    }
  };

  const loadForms = async (key: string) => {
    const r = await fetch(`${API}/api/forms`, { headers: { "x-api-key": key } });
    const d = await r.json();
    setForms(d.forms || []);
  };

  const getEmbed = async (formId: string) => {
    const r = await fetch(`${API}/api/forms/${formId}/embed`, { headers: { "x-api-key": apiKey } });
    const d = await r.json();
    setEmbedCode(d.embedCode || d.error || "Could not generate embed");
  };

  const getInstant = async () => {
    const r = await fetch(`${API}/api/instant-contact-form`);
    const d = await r.json();
    setEmbedCode(d.embedCode || "Could not generate");
  };

  const styles = {
    input: { width: "100%", padding: "10px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9", fontSize: "14px", marginBottom: "10px" } as React.CSSProperties,
    btn: { padding: "10px 20px", background: "#1f6feb", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer", fontSize: "14px", marginRight: "8px" } as React.CSSProperties,
  };

  if (!apiKey) {
    return (
      <div style={{ padding: "20px" }}>
        <h3 style={{ color: "#f8fafc", marginBottom: "16px" }}>Create Your Free Account</h3>
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={register}>Register Free</button>
        <div style={{ marginTop: "16px" }}>
          <button style={{...styles.btn, background: "#238636"}} onClick={getInstant}>Get Instant Contact Form (No Signup)</button>
        </div>
        {status && <p style={{ color: status.includes("error") || status.includes("failed") ? "#f85149" : "#3fb950", marginTop: "12px", fontSize: "13px" }}>{status}</p>}
        {embedCode && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>Copy this code into your HTML:</p>
            <textarea readOnly value={embedCode} style={{ width: "100%", height: "120px", padding: "10px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9", fontFamily: "monospace", fontSize: "12px" }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", borderBottom: "1px solid #30363d", paddingBottom: "8px" }}>
        <button onClick={() => setTab("create")} style={{ background: tab === "create" ? "#1f6feb" : "transparent", border: "none", color: "#c9d1d9", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
          📝 My Forms ({forms.length})
        </button>
        <button onClick={() => setTab("embed")} style={{ background: tab === "embed" ? "#1f6feb" : "transparent", border: "none", color: "#c9d1d9", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>
          🔗 Embed
        </button>
        <button onClick={getInstant} style={{...styles.btn, background: "#238636", marginLeft: "auto"}}>
          ⚡ Instant Form
        </button>
      </div>

      {tab === "create" && (
        <div>
          {forms.map((f: any) => (
            <div key={f.id} onClick={() => getEmbed(f.id)} style={{ padding: "12px", background: "#161b22", border: "1px solid #30363d", borderRadius: "6px", marginBottom: "8px", cursor: "pointer" }}>
              <span style={{ color: "#58a6ff" }}>{f.title}</span>
              <span style={{ color: "#8b949e", fontSize: "12px", marginLeft: "12px" }}>{f.fields?.length || 0} fields · Click for embed</span>
            </div>
          ))}
          {forms.length === 0 && <p style={{ color: "#8b949e" }}>No forms yet. Create one via API or use Instant Form above.</p>}
        </div>
      )}

      {tab === "embed" && embedCode && (
        <div>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>Copy this HTML into your website:</p>
          <textarea readOnly value={embedCode} style={{ width: "100%", height: "200px", padding: "10px", background: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", color: "#c9d1d9", fontFamily: "monospace", fontSize: "12px" }} />
        </div>
      )}
    </div>
  );
}

export default function FormBuilderPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", width: "100%" }}>
        <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          <a href="/" style={{ color: "#dfba6b", textDecoration: "none" }}>Home</a> / <span>Form Builder Pro</span>
        </nav>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", color: "#f8fafc", margin: "0 0 0.5rem 0" }}>Form Builder Pro</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: "1.6" }}>
            Create embeddable forms with custom CSS, CSRF protection, and honeypot spam blocking. No iframes — clean HTML embed. Free tier: 3 forms with unlimited fields.
          </p>
        </div>

        <AdUnit adSlot="3456789012" />

        <div style={{ border: "1px solid rgba(223, 186, 107, 0.15)", borderRadius: "12px", overflow: "hidden", margin: "2rem 0", background: "#0a0f0a" }}>
          <FormBuilderEmbed />
        </div>
      </div>
    </div>
  );
}