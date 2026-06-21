"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("bug");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Turnstile widget when modal opens
  useEffect(() => {
    if (isOpen) {
      const renderWidget = () => {
        if ((window as any).turnstile) {
          try {
            (window as any).turnstile.render("#turnstile-container", {
              sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", // Cloudflare testing always-pass sitekey
              callback: (token: string) => {
                setTurnstileToken(token);
              },
            });
          } catch (e) {
            console.error("Turnstile render error:", e);
          }
        } else {
          // If script not loaded yet, retry in 300ms
          setTimeout(renderWidget, 300);
        }
      };
      renderWidget();
    } else {
      // Clear token and state on close
      setTurnstileToken("");
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMessage("Subject and Message are required.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          category,
          subject,
          message,
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setTurnstileToken("");
        // Close modal after 2 seconds on success
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setErrorMessage(data.error || "Failed to submit feedback.");
        setStatus("error");
        // Reset turnstile widget on failure
        if ((window as any).turnstile) {
          (window as any).turnstile.reset("#turnstile-container");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("A network error occurred. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      {/* Cloudflare Turnstile Script Loader */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={floatingBtnStyle}
        title="Report a bug or give feedback"
        id="feedback-trigger"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Feedback & Bugs</span>
      </button>

      {/* Modal Overlay / Form */}
      {isOpen && (
        <div style={overlayStyle} onClick={() => setIsOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={headerStyle}>
              <h3 style={titleStyle}>Submit Feedback & Bugs</h3>
              <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>
                ✕
              </button>
            </div>

            {status === "success" ? (
              <div style={successStateStyle}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: "1rem" }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h4 style={{ fontWeight: 600, color: "#f5f5f5" }}>Thank you!</h4>
                <p style={{ color: "#a3a3a3", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Your submission has been dispatched securely.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={formStyle}>
                <div style={rowStyle}>
                  {/* Category Selection */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="bug">🐛 Bug Report</option>
                      <option value="feature">💡 Feature Request</option>
                      <option value="question">❓ Question</option>
                      <option value="feedback">⭐ General Feedback</option>
                    </select>
                  </div>
                </div>

                <div style={rowStyle}>
                  {/* Name Input */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      style={inputStyle}
                    />
                  </div>

                  {/* Email Input */}
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Short description of the bug or feedback"
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Message Input */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>Details / Description</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details. If this is a bug, please include steps to reproduce."
                    style={textareaStyle}
                    required
                  />
                </div>

                {/* Turnstile Captcha Container */}
                <div style={turnstileContainerStyle}>
                  <div id="turnstile-container" />
                </div>

                {status === "error" && <div style={errorStyle}>{errorMessage}</div>}

                {/* Submit Buttons */}
                <div style={footerStyle}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={cancelBtnStyle}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    style={submitBtnStyle}
                  >
                    {status === "submitting" ? "Sending..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Styling Constants
const floatingBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "#050705",
  border: "1px solid rgba(223, 186, 107, 0.25)",
  borderRadius: "9999px",
  padding: "0.8rem 1.4rem",
  color: "#dfba6b",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6), 0 0 10px rgba(223, 186, 107, 0.1)",
  transition: "all 0.2s ease",
  backdropFilter: "blur(8px)",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.75)",
  backdropFilter: "blur(4px)",
  zIndex: 1001,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "520px",
  background: "rgba(5, 7, 5, 0.95)",
  border: "1px solid rgba(223, 186, 107, 0.2)",
  borderRadius: "16px",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  color: "#e5e5e5",
  animation: "fadeIn 0.2s ease-out",
};

const headerStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  borderBottom: "1px solid rgba(223, 186, 107, 0.12)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#f5f5f5",
  margin: 0,
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#737373",
  fontSize: "1.1rem",
  cursor: "pointer",
  padding: "0.25rem",
  transition: "color 0.2s",
};

const formStyle: React.CSSProperties = {
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

const fieldStyle: React.CSSProperties = {
  flex: "1 1 200px",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#a3a3a3",
};

const inputStyle: React.CSSProperties = {
  background: "#0d0f0d",
  border: "1px solid rgba(223, 186, 107, 0.15)",
  borderRadius: "8px",
  padding: "0.6rem 0.8rem",
  color: "#f5f5f5",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='%23dfba6b' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "100px",
  resize: "vertical",
  fontFamily: "inherit",
};

const turnstileContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  margin: "0.25rem 0",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "0.5rem",
};

const cancelBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "0.6rem 1.2rem",
  color: "#a3a3a3",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
};

const submitBtnStyle: React.CSSProperties = {
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.4rem",
  color: "#050705",
  fontSize: "0.9rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  background: "rgba(239, 68, 68, 0.1)",
  padding: "0.6rem 0.8rem",
  borderRadius: "8px",
  border: "1px solid rgba(239, 68, 68, 0.15)",
  fontSize: "0.85rem",
};

const successStateStyle: React.CSSProperties = {
  padding: "3rem 1.5rem",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
