"use client";

import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("nadirtools-cookie-consent");
    if (!consent) {
      // Small timeout to animate banner after page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nadirtools-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("nadirtools-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={bannerStyle} id="cookie-consent-banner">
      <div style={containerStyle}>
        <div style={textContainerStyle}>
          <h4 style={titleStyle}>🍪 Cookie & Ads Settings</h4>
          <p style={descStyle}>
            NadirTools runs entirely client-side. We use Google AdSense cookies to serve relevant sponsor banners. 
            Read our <a href="/privacy" style={linkStyle}>Privacy & Cookie Disclosures</a> for details.
          </p>
        </div>
        <div style={buttonContainerStyle}>
          <button onClick={handleDecline} style={declineBtnStyle}>
            Decline
          </button>
          <button onClick={handleAccept} style={acceptBtnStyle}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

// Styling Constants
const bannerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  background: "rgba(5, 7, 5, 0.98)",
  borderTop: "1px solid rgba(223, 186, 107, 0.2)",
  boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.8)",
  padding: "1.25rem 2rem",
  backdropFilter: "blur(12px)",
  animation: "slideUp 0.3s ease-out",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1.25rem",
};

const textContainerStyle: React.CSSProperties = {
  flex: "1 1 500px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#dfba6b",
  marginBottom: "0.25rem",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#cbd5e1",
  lineHeight: "1.5",
};

const linkStyle: React.CSSProperties = {
  color: "#22c55e",
  textDecoration: "underline",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "nowrap",
};

const declineBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "0.5rem 1.25rem",
  color: "#a3a3a3",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const acceptBtnStyle: React.CSSProperties = {
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  padding: "0.5rem 1.25rem",
  color: "#050705",
  fontSize: "0.85rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s",
};
