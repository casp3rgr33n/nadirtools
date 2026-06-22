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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', filter: 'drop-shadow(0 0 4px rgba(0,255,208,0.4))' }}>
                  <path d="M12 21L3 12h4V3h10v9h4L12 21z" fill="url(#grad)" opacity="0.8" />
                  <path d="M12 21L3 12h4V3h10v9h4L12 21z" stroke="#00ffd0" strokeWidth="1.5" />
                  <circle cx="12" cy="15" r="2.5" fill="#dfba6b" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00ffd0" stopOpacity="0.1" />
                      <stop offset="1" stopColor="#dfba6b" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span style={{ color: "#dfba6b" }}>Nadir</span><span style={{ color: "#00ffd0", textShadow: "0 0 8px rgba(0,255,208,0.4)" }}>Tools</span>
              </a>
              <div style={badgeStyle}>Solitude Dark Labs</div>
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

const badgeStyle: React.CSSProperties = {
  background: "rgba(0, 255, 208, 0.05)",
  border: "1px solid rgba(0, 255, 208, 0.2)",
  borderRadius: "12px",
  padding: "0.25rem 0.75rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#00ffd0",
  letterSpacing: "0.5px"
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
  padding: "2rem 0"
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