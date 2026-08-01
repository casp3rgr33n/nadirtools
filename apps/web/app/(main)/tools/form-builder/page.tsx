"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdUnit from "../../../../components/AdUnit";

// ─── Constants ──────────────────────────────────────────────────────────────
const API = "https://api.nadirtools.com";
const LS_KEY = "nadirtools_form_builder_api_key";

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#050705",
  cardBg: "#0a0f0a",
  inputBg: "#0d1117",
  elevatedBg: "#141c15",
  border: "rgba(223, 186, 107, 0.12)",
  borderActive: "#dfba6b",
  gold: "#dfba6b",
  goldDim: "rgba(223, 186, 107, 0.6)",
  blue: "#58a6ff",
  green: "#00ffb3",
  greenBtn: "#238636",
  red: "#f85149",
  orange: "#d2991d",
  text: "#f8fafc",
  textDim: "#cbd5e1",
  muted: "#94a3b8",
  mutedDarker: "#8b949e",
  font: "'Outfit', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// ─── Shared Styles ───────────────────────────────────────────────────────────
const shared = {
  card: {
    background: T.cardBg,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "24px",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "12px 14px",
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: "8px",
    color: T.text,
    fontSize: "15px",
    fontFamily: T.font,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "14px",
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: "8px",
    color: T.textDim,
    fontFamily: T.mono,
    fontSize: "13px",
    lineHeight: "1.6",
    resize: "vertical" as const,
    outline: "none",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  pill: (active: boolean, color: string = T.blue) => ({
    padding: "8px 16px",
    background: active ? color : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? color : "rgba(255,255,255,0.06)"}`,
    borderRadius: "8px",
    color: active ? "#fff" : T.muted,
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.15s",
    fontFamily: T.font,
  } as React.CSSProperties),
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormRecord {
  id: string;
  title: string;
  fields?: { name: string; type: string; label: string }[];
}

type AppState = "loading" | "login" | "register" | "dashboard";

// ─── API Helpers ─────────────────────────────────────────────────────────────
async function apiFetch(
  path: string,
  opts: RequestInit = {},
  apiKey?: string
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
    ...((opts.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  return res.json();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animation: "fb-spin 0.8s linear infinite" }}
    >
      <circle
        cx="12" cy="12" r="10"
        fill="none"
        stroke={T.border}
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        fill="none"
        stroke={T.gold}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Toast({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "success" | "error" | "warning";
}) {
  const colors = {
    info: { bg: "rgba(88,166,255,0.08)", border: T.blue, text: T.blue },
    success: { bg: "rgba(0,255,179,0.06)", border: T.green, text: T.green },
    error: { bg: "rgba(248,81,73,0.08)", border: T.red, text: T.red },
    warning: {
      bg: "rgba(210,153,29,0.08)",
      border: T.orange,
      text: T.orange,
    },
  };
  const c = colors[type];
  return (
    <div
      style={{
        padding: "12px 16px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `3px solid ${c.border}`,
        borderRadius: "8px",
        color: c.text,
        fontSize: "14px",
        lineHeight: "1.5",
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: T.muted,
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <h3
        style={{
          color: T.textDim,
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "14px", lineHeight: "1.6", maxWidth: "400px", margin: "0 auto 20px" }}>
        {description}
      </p>
      {action}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function FormBuilderEmbed() {
  // ── State ──
  const [appState, setAppState] = useState<AppState>("loading");
  const [apiKey, setApiKey] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userTier, setUserTier] = useState<string>("");

  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error" | "warning">("info");

  // Dashboard state
  const [tab, setTab] = useState<"forms" | "embed">("forms");
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [embedLoading, setEmbedLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormRecord | null>(null);

  // ── Init: load API key from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setApiKey(parsed.api_key || "");
        setUserEmail(parsed.email || "");
        setUserTier(parsed.tier || "");
        setAppState("dashboard");
      } catch {
        localStorage.removeItem(LS_KEY);
        setAppState("login");
      }
    } else {
      setAppState("login");
    }
  }, []);

  // ── Load forms when entering dashboard ──
  useEffect(() => {
    if (appState === "dashboard" && apiKey) {
      loadForms();
    }
  }, [appState, apiKey]);

  // ── Helpers ──
  const saveToStore = (key: string, emailAddr: string, tier: string) => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ api_key: key, email: emailAddr, tier })
    );
    setApiKey(key);
    setUserEmail(emailAddr);
    setUserTier(tier);
  };

  const clearStore = () => {
    localStorage.removeItem(LS_KEY);
    setApiKey("");
    setUserEmail("");
    setUserTier("");
    setForms([]);
    setEmbedCode("");
    setAppState("login");
  };

  const showStatus = (
    msg: string,
    type: "info" | "success" | "error" | "warning"
  ) => {
    setStatus(msg);
    setStatusType(type);
  };

  const loadForms = useCallback(async () => {
    setFormsLoading(true);
    try {
      const d = await apiFetch("/api/forms", {}, apiKey);
      setForms(d.forms || []);
    } catch {
      setForms([]);
    }
    setFormsLoading(false);
  }, [apiKey]);

  // ── Auth actions ──
  const handleRegister = async () => {
    if (!email.trim()) {
      showStatus("Please enter your email address.", "warning");
      return;
    }
    if (password.length < 6) {
      showStatus("Password must be at least 6 characters.", "warning");
      return;
    }
    setAuthLoading(true);
    setStatus("");
    try {
      const d = await apiFetch(
        "/api/register",
        { method: "POST", body: JSON.stringify({ email: email.trim(), password }) }
      );
      if (d.api_key) {
        saveToStore(d.api_key, d.email || email.trim(), d.tier || "free");
        showStatus(`Welcome! Your ${d.tier || "free"} account is ready.`, "success");
        setAppState("dashboard");
      } else {
        showStatus(d.error || "Registration failed. Please try again.", "error");
      }
    } catch {
      showStatus("Connection error — check your internet and try again.", "error");
    }
    setAuthLoading(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showStatus("Please enter your email and password.", "warning");
      return;
    }
    setAuthLoading(true);
    setStatus("");
    try {
      const d = await apiFetch(
        "/api/login",
        { method: "POST", body: JSON.stringify({ email: email.trim(), password }) }
      );
      if (d.api_key) {
        saveToStore(d.api_key, email.trim(), d.tier || "free");
        showStatus("Signed in successfully.", "success");
        setAppState("dashboard");
      } else {
        showStatus(d.error || "Invalid credentials. Please try again.", "error");
      }
    } catch {
      showStatus("Connection error — check your internet and try again.", "error");
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    clearStore();
    setEmail("");
    setPassword("");
    setStatus("");
  };

  // ── Form actions ──
  const handleCreateForm = async () => {
    setCreateLoading(true);
    try {
      const d = await apiFetch(
        "/api/forms",
        {
          method: "POST",
          body: JSON.stringify({
            title: `New Form ${new Date().toLocaleDateString()}`,
          }),
        },
        apiKey
      );
      if (d.id) {
        showStatus("Form created successfully.", "success");
        await loadForms();
      } else {
        showStatus(d.error || "Could not create form.", "error");
      }
    } catch {
      showStatus("Failed to create form. Please try again.", "error");
    }
    setCreateLoading(false);
  };

  const handleGetEmbed = async (form: FormRecord) => {
    setSelectedForm(form);
    setEmbedLoading(true);
    setEmbedCode("");
    try {
      const d = await apiFetch(`/api/forms/${form.id}/embed`, {}, apiKey);
      if (d.embedCode) {
        setEmbedCode(d.embedCode);
        setTab("embed");
      } else {
        showStatus(d.error || "Could not generate embed code.", "error");
      }
    } catch {
      showStatus("Failed to get embed code. Please try again.", "error");
    }
    setEmbedLoading(false);
  };

  const handleInstantForm = async () => {
    setEmbedLoading(true);
    setEmbedCode("");
    setSelectedForm(null);
    try {
      const d = await apiFetch("/api/instant-contact-form");
      if (d.embedCode) {
        setEmbedCode(d.embedCode);
        setTab("embed");
      } else {
        showStatus(d.error || "Could not generate instant form.", "error");
      }
    } catch {
      showStatus("Network error — check your connection.", "error");
    }
    setEmbedLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showStatus("Copied to clipboard!", "success");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      // fallback
      showStatus("Select the code and press Ctrl+C to copy.", "info");
    }
  };

  // ── Loading state ──
  if (appState === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 24px",
          gap: "16px",
        }}
      >
        <Spinner size={32} />
        <p style={{ color: T.muted, fontSize: "14px" }}>Loading your dashboard…</p>
      </div>
    );
  }

  // ── Login / Register screens ──
  if (appState === "login" || appState === "register") {
    const isRegister = appState === "register";
    return (
      <div style={{ padding: "32px 16px", maxWidth: "440px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, rgba(223,186,107,0.15), rgba(88,166,255,0.15))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 16px",
              border: `1px solid ${T.border}`,
            }}
          >
            📋
          </div>
          <h3
            style={{
              color: T.text,
              fontSize: "clamp(20px, 4vw, 24px)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {isRegister ? "Create Your Free Account" : "Welcome Back"}
          </h3>
          <p style={{ color: T.muted, fontSize: "14px", lineHeight: "1.5" }}>
            {isRegister
              ? "3 forms, unlimited fields, instant embed. No credit card required."
              : "Sign in to manage your forms and generate embed codes."}
          </p>
        </div>

        {/* Auth card */}
        <div style={shared.card}>
          {/* Email */}
          <label
            style={{
              color: T.muted,
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "6px",
              display: "block",
            }}
          >
            Email
          </label>
          <input
            style={{ ...shared.input, marginBottom: "16px" }}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          {/* Password */}
          <label
            style={{
              color: T.muted,
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "6px",
              display: "block",
            }}
          >
            Password
          </label>
          <input
            style={{ ...shared.input, marginBottom: "20px" }}
            type="password"
            placeholder={isRegister ? "Min 6 characters" : "Your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            onKeyDown={(e) => {
              if (e.key === "Enter") isRegister ? handleRegister() : handleLogin();
            }}
          />

          {/* Submit */}
          <button
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "13px 20px",
              background: authLoading
                ? "rgba(223,186,107,0.3)"
                : `linear-gradient(135deg, ${T.gold}, #c9a048)`,
              border: "none",
              borderRadius: "8px",
              color: "#050705",
              fontWeight: 700,
              fontSize: "15px",
              cursor: authLoading ? "wait" : "pointer",
              fontFamily: T.font,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {authLoading ? (
              <>
                <Spinner size={18} />{" "}
                {isRegister ? "Creating account…" : "Signing in…"}
              </>
            ) : isRegister ? (
              "Create Free Account"
            ) : (
              "Sign In"
            )}
          </button>

          {/* Toggle auth mode */}
          <p
            style={{
              textAlign: "center",
              color: T.mutedDarker,
              fontSize: "13px",
              marginTop: "16px",
            }}
          >
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <button
              onClick={() => {
                setAppState(isRegister ? "login" : "register");
                setStatus("");
              }}
              style={{
                background: "none",
                border: "none",
                color: T.blue,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: T.font,
                textDecoration: "underline",
              }}
            >
              {isRegister ? "Sign in" : "Register free"}
            </button>
          </p>
        </div>

        {/* Status */}
        {status && (
          <div style={{ marginTop: "16px" }}>
            <Toast type={statusType}>{status}</Toast>
          </div>
        )}

        {/* Instant Contact Form (always visible) */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <div
            style={{
              borderTop: `1px solid ${T.border}`,
              paddingTop: "24px",
            }}
          >
            <p
              style={{
                color: T.mutedDarker,
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              Just need a contact form? No signup required.
            </p>
            <button
              onClick={handleInstantForm}
              disabled={embedLoading}
              style={{
                padding: "11px 20px",
                background: "transparent",
                border: `1px solid ${T.gold}`,
                borderRadius: "8px",
                color: T.gold,
                cursor: embedLoading ? "wait" : "pointer",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: T.font,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {embedLoading ? (
                <>
                  <Spinner size={16} /> Generating…
                </>
              ) : (
                <>
                  ⚡ Instant Contact Form
                </>
              )}
            </button>
            {embedCode && (
              <div style={{ marginTop: "16px", textAlign: "left" }}>
                <div style={shared.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: T.textDim, fontSize: "14px", fontWeight: 600 }}>
                      Your Embed Code
                    </span>
                    <button
                      onClick={() => handleCopy(embedCode)}
                      style={{
                        background: `rgba(223,186,107,0.1)`,
                        border: `1px solid ${T.goldDim}`,
                        borderRadius: "6px",
                        color: T.gold,
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "4px 12px",
                        fontWeight: 600,
                        fontFamily: T.font,
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={embedCode}
                    style={shared.textarea}
                    onClick={(e) => {
                      (e.target as HTMLTextAreaElement).select();
                      handleCopy(embedCode);
                    }}
                  />
                  <p
                    style={{
                      color: T.mutedDarker,
                      fontSize: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Paste this HTML into your website. Form submissions are handled
                    securely.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div style={{ padding: "24px 16px" }}>
      {/* Dashboard header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div>
          <h3
            style={{
              color: T.text,
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 700,
              margin: "0 0 4px 0",
            }}
          >
            📋 My Dashboard
          </h3>
          <p style={{ color: T.muted, fontSize: "13px", margin: 0 }}>
            {userEmail} · {userTier || "free"} tier
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleCreateForm}
            disabled={createLoading}
            style={{
              padding: "9px 16px",
              background: createLoading
                ? "rgba(223,186,107,0.3)"
                : T.gold,
              border: "none",
              borderRadius: "8px",
              color: "#050705",
              fontWeight: 700,
              fontSize: "13px",
              cursor: createLoading ? "wait" : "pointer",
              fontFamily: T.font,
              transition: "all 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {createLoading ? <Spinner size={14} /> : "＋"}
            New Form
          </button>
          <button
            onClick={handleInstantForm}
            disabled={embedLoading}
            style={{
              padding: "9px 16px",
              background: "transparent",
              border: `1px solid ${T.green}`,
              borderRadius: "8px",
              color: T.green,
              fontWeight: 600,
              fontSize: "13px",
              cursor: embedLoading ? "wait" : "pointer",
              fontFamily: T.font,
              transition: "all 0.15s",
            }}
          >
            ⚡ Instant
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "9px 16px",
              background: "transparent",
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: "8px",
              color: T.mutedDarker,
              fontWeight: 500,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: T.font,
              transition: "all 0.15s",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Status toast */}
      {status && (
        <div style={{ marginBottom: "16px" }}>
          <Toast type={statusType}>{status}</Toast>
        </div>
      )}

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setTab("forms")}
          style={shared.pill(tab === "forms", T.blue)}
        >
          📝 My Forms{forms.length > 0 ? ` (${forms.length})` : ""}
        </button>
        <button
          onClick={() => setTab("embed")}
          style={shared.pill(tab === "embed", T.blue)}
        >
          🔗 Embed
        </button>
      </div>

      {/* ─── Forms Tab ─── */}
      {tab === "forms" && (
        <div>
          {formsLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 0",
                gap: "12px",
              }}
            >
              <Spinner size={28} />
              <p style={{ color: T.muted, fontSize: "14px" }}>Loading forms…</p>
            </div>
          ) : forms.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No forms yet"
              description="Create your first form to get an embed code you can drop into any website. Click the gold button above to get started."
              action={
                <button
                  onClick={handleCreateForm}
                  disabled={createLoading}
                  style={{
                    padding: "11px 20px",
                    background: T.gold,
                    border: "none",
                    borderRadius: "8px",
                    color: "#050705",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  ＋ Create Your First Form
                </button>
              }
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {forms.map((form) => (
                <div
                  key={form.id}
                  onClick={() => handleGetEmbed(form)}
                  style={{
                    padding: "16px",
                    background: embedLoading && selectedForm?.id === form.id
                      ? "rgba(223,186,107,0.03)"
                      : T.cardBg,
                    border: `1px solid ${embedLoading && selectedForm?.id === form.id ? T.goldDim : T.border}`,
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: T.textDim,
                        fontWeight: 600,
                        fontSize: "15px",
                        marginBottom: "4px",
                        wordBreak: "break-word",
                      }}
                    >
                      {form.title || "Untitled Form"}
                    </div>
                    <div style={{ color: T.mutedDarker, fontSize: "13px" }}>
                      {form.fields?.length || 0} fields ·{" "}
                      <span style={{ color: T.goldDim }}>
                        Tap for embed code
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: T.gold,
                      fontSize: "13px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {embedLoading && selectedForm?.id === form.id ? (
                      <Spinner size={16} />
                    ) : (
                      "🔗"
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Embed Tab ─── */}
      {tab === "embed" && (
        <div>
          {embedLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 0",
                gap: "12px",
              }}
            >
              <Spinner size={28} />
              <p style={{ color: T.muted, fontSize: "14px" }}>
                Generating embed code…
              </p>
            </div>
          ) : embedCode ? (
            <div style={shared.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <span style={{ color: T.text, fontWeight: 600, fontSize: "15px" }}>
                    {selectedForm
                      ? `Embed: ${selectedForm.title || "Untitled"}`
                      : "⚡ Instant Contact Form"}
                  </span>
                  <br />
                  <span style={{ color: T.mutedDarker, fontSize: "12px" }}>
                    Paste this into your website&apos;s HTML
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(embedCode)}
                  style={{
                    padding: "8px 16px",
                    background: `rgba(223,186,107,0.1)`,
                    border: `1px solid ${T.goldDim}`,
                    borderRadius: "8px",
                    color: T.gold,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: T.font,
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
              <textarea
                readOnly
                value={embedCode}
                style={{
                  ...shared.textarea,
                  minHeight: "180px",
                }}
                onClick={(e) => {
                  (e.target as HTMLTextAreaElement).select();
                }}
              />
              <p
                style={{
                  color: T.mutedDarker,
                  fontSize: "12px",
                  marginTop: "10px",
                  lineHeight: "1.5",
                }}
              >
                ⚡ Form submissions are automatically handled with CSRF
                protection and spam filtering. No backend code needed.
              </p>
            </div>
          ) : (
            <EmptyState
              icon="🔗"
              title="No embed code selected"
              description="Go to My Forms and tap a form to generate its embed code, or use the Instant Contact Form for a ready-to-use embed."
              action={
                <button
                  onClick={() => setTab("forms")}
                  style={{
                    padding: "11px 20px",
                    background: T.blue,
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    fontFamily: T.font,
                  }}
                >
                  View My Forms →
                </button>
              }
            />
          )}
        </div>
      )}

      {/* Quick tip */}
      {tab === "forms" && forms.length > 0 && (
        <div
          style={{
            marginTop: "24px",
            padding: "14px 16px",
            background: "rgba(88,166,255,0.04)",
            border: `1px solid rgba(88,166,255,0.1)`,
            borderRadius: "8px",
            color: T.muted,
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          💡 <strong style={{ color: T.blue }}>Tip:</strong> Tap any form above to
          instantly generate its embed code. The embed code is a clean HTML form
          — no iframes, no third-party scripts. Just paste and go.
        </div>
      )}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function FormBuilderPage() {
  return (
    <>
      <style>{`
        @keyframes fb-spin {
          to { transform: rotate(360deg); }
        }

        /* Focus ring for inputs */
        .fb-card input:focus,
        .fb-card textarea:focus {
          outline: none;
          border-color: #dfba6b !important;
          box-shadow: 0 0 0 3px rgba(223, 186, 107, 0.12);
        }

        .fb-card button:active:not(:disabled) {
          transform: scale(0.97);
        }

        /* Mobile refinements */
        @media (max-width: 640px) {
          .fb-container {
            padding: 1rem 0.5rem !important;
          }
          .fb-hero h1 {
            font-size: 1.5rem !important;
          }
          .fb-hero p {
            font-size: 0.9rem !important;
            line-height: 1.6 !important;
          }
        }
      `}</style>

      <div
        className="fb-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
          width: "100%",
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          <a
            href="/"
            style={{ color: "#dfba6b", textDecoration: "none" }}
          >
            Home
          </a>{" "}
          / <span style={{ color: "#94a3b8" }}>Form Builder Pro</span>
        </nav>

        {/* Hero */}
        <div className="fb-hero" style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              color: "#f8fafc",
              margin: "0 0 0.5rem 0",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Form Builder Pro
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              lineHeight: "1.7",
              maxWidth: "640px",
            }}
          >
            Embeddable forms with custom CSS, CSRF tokens, and spam protection.
            Clean HTML — no iframes needed. Free: 3 forms + unlimited fields.
          </p>
        </div>

        {/* Ad */}
        <AdUnit adSlot="3456789012" />

        {/* Card wrapper */}
        <div
          className="fb-card"
          style={{
            border: "1px solid rgba(223, 186, 107, 0.15)",
            borderRadius: "12px",
            overflow: "hidden",
            margin: "2rem 0",
            background: "#0a0f0a",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <FormBuilderEmbed />
        </div>
      </div>
    </>
  );
}
