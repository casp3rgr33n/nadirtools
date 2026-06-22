import React from "react";
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
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
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
                Nadir<span style={{ color: "#22c55e" }}>Tools</span>
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


const globalStyles = `
  /* Reset and Base Styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #050705;
    color: #e2e8f0;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Custom Premium Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #050705;
  }

  ::-webkit-scrollbar-thumb {
    background: #141c15;
    border-radius: 5px;
    border: 2px solid #050705;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #22c55e;
  }

  /* Table styling enhancements */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  th {
    color: #94a3b8;
    font-weight: 600;
  }

  /* Links & typography rules */
  a {
    color: #22c55e;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  a:hover {
    color: #4ade80;
    text-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  }

  code, pre {
    font-family: 'JetBrains Mono', monospace;
  }

  /* Responsive Catch-All Tools Layout */
  .tools-container {
    display: flex;
    flex-direction: column-reverse; /* Tool first on mobile */
    gap: 2rem;
    width: 100%;
  }

  @media (min-width: 768px) {
    .tools-container {
      flex-direction: column; /* Articles first on desktop */
    }
  }
\`;

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
  background: "rgba(223, 186, 107, 0.05)",
  border: "1px solid rgba(223, 186, 107, 0.2)",
  borderRadius: "12px",
  padding: "0.25rem 0.75rem",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#dfba6b",
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
