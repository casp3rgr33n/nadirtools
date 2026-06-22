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
                <img 
                  src="/logo.jpg" 
                  alt="NadirTools" 
                  style={{ height: '140px', width: 'auto', borderRadius: '16px', objectFit: 'contain', mixBlendMode: 'lighten' }} 
                />
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
  backgroundColor: "#050705",
  backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(0, 255, 208, 0.05) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg width='40' height='69' viewBox='0 0 40 69' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 34.54l10-5.77v-11.54L0 11.46v23.08zm20-11.54l10-5.77v-11.54L20 0 10 5.77v11.54l10 5.77zm0 23.08l10-5.77v-11.54L20 23.08l-10 5.77v11.54l10 5.77zm0 23.08l10-5.77v-11.54L20 46.16l-10 5.77v11.54l10 5.77zM40 11.46l-10-5.77v-11.54L40-11.54v23.08zm0 23.08l-10-5.77v-11.54L40 11.54v23.08zm0 23.08l-10-5.77v-11.54L40 34.62v23.08z' fill='%2300ffd0' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E"),
    radial-gradient(circle at 50% -20%, #17202a 0%, #050705 70%)
  `
};

const headerStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(223, 186, 107, 0.15)",
  backdropFilter: "blur(12px)",
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(15, 21, 28, 0.85)"
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