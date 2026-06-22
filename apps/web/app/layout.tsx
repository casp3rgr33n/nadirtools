import React from "react";
import "./globals.css";
import FeedbackWidget from "../components/FeedbackWidget";
import CookieConsent from "../components/CookieConsent";

export const metadata = {
  title: "NadirTools | Solitude Dark Labs Product Suite",
  description: "High-performance, client-side developer, sysadmin, and business utility engines optimized for speed and absolute privacy."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        
        {/* Google AdSense Code Snippet */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6928785219078585"
          crossOrigin="anonymous"
        />
      </head>


      <body>
        <div style={containerStyle}>
          {/* Header */}
          <header style={headerStyle}>
            <div style={headerContainerStyle}>
              <a href="/" style={logoStyle}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ marginRight: '12px' }}>
                  {/* Green bracket accents */}
                  <path d="M4 10V4h6" stroke="#00ffd0" strokeWidth="2" fill="none" strokeLinecap="square" />
                  <circle cx="10" cy="4" r="1.5" fill="#00ffd0" />
                  <path d="M28 22v6h-6" stroke="#00ffd0" strokeWidth="2" fill="none" strokeLinecap="square" />
                  <circle cx="22" cy="28" r="1.5" fill="#00ffd0" />
                  
                  {/* Gold NV Shape */}
                  <path d="M10 24V8l8 10V8h4v16l-8-10v10h-4z" fill="url(#goldGrad)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
                  <path d="M8 26l8 6 8-6" stroke="url(#goldGrad)" strokeWidth="2" fill="none" strokeLinejoin="miter" />
                  
                  <defs>
                    <linearGradient id="goldGrad" x1="10" y1="8" x2="22" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fef0aa" />
                      <stop offset="0.5" stopColor="#dfba6b" />
                      <stop offset="1" stopColor="#a37922" />
                    </linearGradient>
                  </defs>
                </svg>
                <span style={{ color: "#dfba6b", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Nadir</span>
                <span style={{ color: "#00ffd0", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", textShadow: "0 0 10px rgba(0,255,208,0.4)" }}>Tools</span>
              </a>
              
            </div>
          </header>

          {/* Main Content */}
          <main style={mainStyle}>{children}</main>

          {/* Footer */}
          <footer style={footerStyle}>
            <div style={footerContainerStyle}>
              <div>© 2026 NadirTools. A product of Solitude Dark Labs. All rights reserved.</div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <a href="/" style={footerLinkStyle}>Home</a>
                <a href="/privacy" style={footerLinkStyle}>Privacy Policy</a>
                <a href="https://github.com/casp3rgr33n/nadirtools" target="_blank" rel="noreferrer" style={footerLinkStyle}>GitHub</a>
              </div>
            </div>
          </footer>
          <FeedbackWidget />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}




const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundImage: "radial-gradient(circle at 50% -20%, #112214 0%, #050705 70%)"
};

const headerStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(223, 186, 107, 0.15)",
  backdropFilter: "blur(12px)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(5, 7, 5, 0.7)"
};

const headerContainerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const logoStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  color: "#f8fafc",
  display: "flex",
  alignItems: "center"
};



const mainStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "2rem"
};

const footerStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(223, 186, 107, 0.12)",
  background: "#030403",
  color: "#64748b",
  fontSize: "0.85rem",
  padding: "2rem 0 6rem 0"
};

const footerContainerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem"
};

const footerLinkStyle: React.CSSProperties = {
  color: "#64748b",
  textDecoration: "none"
};