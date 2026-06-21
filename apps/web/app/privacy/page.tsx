import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Cookie Disclosures - NadirTools",
  description: "Learn how NadirTools protects your privacy with 100% client-side calculation models and AdSense cookie compliance.",
  alternates: {
    canonical: "https://nadirtools.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Privacy Policy & Cookie Disclosures</h1>
        <p style={subtitleStyle}>Effective Date: June 21, 2026</p>
      </header>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>1. Zero-Telemetry Privacy Commitment</h2>
        <p style={pStyle}>
          At **NadirTools** (a product of Solitude Dark Labs), we maintain absolute commitment to user privacy. 
          **100% of all calculations, formatting, parsing, and data validation are performed entirely client-side inside your browser.**
        </p>
        <p style={pStyle}>
          None of your data inputs (including database schema parameters, IP addresses, financial matrices, cron expressions, or email inputs) 
          are ever uploaded, transmitted, or logged to our servers. Your data stays securely on your machine.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>2. Google AdSense Cookie Disclosures</h2>
        <p style={pStyle}>
          To keep NadirTools free, we display third-party advertisements served by **Google AdSense**. Google AdSense uses cookies to serve 
          contextual and personalized ads based on your visits to this site and other websites on the internet.
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to this site and/or other sites.
          </li>
          <li style={listItemStyle}>
            You may opt-out of personalized advertising altogether by visiting the{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={linkStyle}>
              Google Ads Settings portal
            </a>.
          </li>
          <li style={listItemStyle}>
            Alternatively, you can opt-out of a third-party vendor's use of cookies for personalized advertising by visiting{" "}
            <a href="http://www.aboutads.info/choices" target="_blank" rel="noreferrer" style={linkStyle}>
              www.aboutads.info/choices
            </a>.
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>3. Consent Management (GDPR, CCPA/CPRA)</h2>
        <p style={pStyle}>
          For users residing in the European Economic Area (EEA), United Kingdom, or California, we employ a Consent Management 
          Platform to respect your tracking choices. 
        </p>
        <p style={pStyle}>
          You have the right to accept, reject, or customize the types of cookies you permit. Rejecting cookies will not prevent you from using 
          any calculators on NadirTools, and ads will be limited to non-personalized contextual delivery.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>4. Contact Us</h2>
        <p style={pStyle}>
          If you have any questions regarding this Privacy Policy or cookies, please contact the Solitude Dark Labs system administrator 
          using the floating **Feedback & Bugs** button at the bottom-right corner of the interface.
        </p>
      </section>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "1rem 0 4rem 0",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "3rem",
  borderBottom: "1px solid rgba(223, 186, 107, 0.12)",
  paddingBottom: "1.5rem",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.25rem",
  fontWeight: 800,
  color: "#f8fafc",
  marginBottom: "0.5rem",
};

const subtitleStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "0.9rem",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 12, 0.3)",
  border: "1px solid rgba(223, 186, 107, 0.08)",
  borderRadius: "16px",
  padding: "2rem",
  marginBottom: "2rem",
  boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#dfba6b",
  marginBottom: "1rem",
  letterSpacing: "-0.3px",
};

const pStyle: React.CSSProperties = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const listStyle: React.CSSProperties = {
  paddingLeft: "1.5rem",
  marginBottom: "1rem",
};

const listItemStyle: React.CSSProperties = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  fontSize: "0.95rem",
  marginBottom: "0.75rem",
};

const linkStyle: React.CSSProperties = {
  color: "#22c55e",
  textDecoration: "underline",
};
