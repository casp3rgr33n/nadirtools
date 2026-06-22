"use client";

import React, { useState } from "react";
import toolConstants from "../../../config/tool-constants.json";

export default function HomeClient() {
  const [search, setSearch] = useState("");
  const toolsList = Object.values(toolConstants.tools);

  const filteredTools = toolsList.filter((tool: any) => {
    const query = search.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Hero Section */}
      <div style={heroContainerStyle}>
        <h1 style={heroTitleStyle}>
          Mathematical Precision. <span style={{ color: "#ffd75e" }}>Zero Latency.</span>
        </h1>
        <p style={heroSubStyle}>
          NadirTools is a suite of foundational, client-side utility engines built for engineers, sysadmins, and financial analysts. 100% of calculations execute in your browser with zero data transmission.
        </p>

        {/* Search Input */}
        <div style={searchContainerStyle}>
          <svg
            style={searchIconStyle}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search utility engines, CIDR formulas, tax matrices, or cron schedulers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Quick Access Categories */}
        <div style={quickAccessStyle}>
          {["Networking", "Security", "Finance", "Developer"].map(cat => (
            <button key={cat} onClick={() => setSearch(cat)} style={{
              ...categoryPillStyle,
              background: search.toLowerCase() === cat.toLowerCase() ? "rgba(0, 255, 179, 0.15)" : "rgba(0, 255, 179, 0.05)",
              border: search.toLowerCase() === cat.toLowerCase() ? "1px solid rgba(0, 255, 179, 0.4)" : "1px solid rgba(0, 255, 179, 0.1)"
            }}>
              {cat}
            </button>
          ))}
          {search && (
            <button onClick={() => setSearch("")} style={{ ...categoryPillStyle, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of Tools */}
      <div>
        <h2 style={sectionTitleStyle}>Foundational Tools & Calculators</h2>
        <div style={gridStyle}>
          {filteredTools.map((tool: any) => (
            <a key={tool.slug} href={`/tools/${tool.slug}`} style={cardLinkStyle}>
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={categoryBadgeStyle}>{tool.category.toUpperCase()}</span>
                </div>
                <h3 style={cardTitleStyle}>{tool.name}</h3>
                <p style={cardDescStyle}>{tool.description}</p>
                <div style={cardFooterStyle}>
                  <span>Launch Engine</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
          {filteredTools.length === 0 && (
            <div style={noResultsStyle}>
              No tools match your query. Try searching for "subnet", "tax", "firewall", or "cron".
            </div>
          )}
        </div>
      </div>

      {/* Security Moat Banner */}
      <div style={moatBannerStyle}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={shieldIconContainerStyle}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00ffb3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f8fafc", marginBottom: "0.25rem" }}>
              Client-Side Isolation Architecture
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: "1.4" }}>
              Unlike online tools that ingest payloads into backend telemetries, NadirTools runs exclusively in your browser context. Absolutely zero string inputs, firewall rules, or financial inputs are uploaded or cataloged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const heroContainerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "4rem 0 2.5rem 0",
  maxWidth: "800px",
  margin: "0 auto"
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: 800,
  letterSpacing: "-1px",
  lineHeight: "1.1",
  color: "#f8fafc",
  marginBottom: "1.5rem"
};

const heroSubStyle: React.CSSProperties = {
  fontSize: "1.15rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "2.5rem"
};

const searchContainerStyle: React.CSSProperties = {
  position: "relative",
  maxWidth: "600px",
  margin: "0 auto",
  width: "100%"
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  left: "1.25rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
  pointerEvents: "none"
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(20, 32, 22, 0.4)",
  border: "1px solid rgba(223, 186, 107, 0.15)",
  borderRadius: "9999px",
  padding: "1rem 1.5rem 1rem 3.25rem",
  color: "#f8fafc",
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
};

const quickAccessStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  justifyContent: "center",
  marginTop: "1.5rem",
  flexWrap: "wrap"
};

const categoryPillStyle: React.CSSProperties = {
  color: "#00ffb3",
  fontSize: "0.85rem",
  fontWeight: 600,
  padding: "0.5rem 1rem",
  borderRadius: "9999px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none"
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f1f5f9",
  marginBottom: "1.5rem",
  marginTop: "3rem"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "1.5rem"
};

const cardLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit"
};

const cardStyle: React.CSSProperties = {
  background: "rgba(20, 32, 22, 0.2)",
  border: "1px solid rgba(223, 186, 107, 0.1)",
  borderRadius: "16px",
  padding: "1.75rem",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer"
};

const cardHeaderStyle: React.CSSProperties = {
  marginBottom: "1rem"
};

const categoryBadgeStyle: React.CSSProperties = {
  background: "rgba(0, 255, 179, 0.08)",
  border: "1px solid rgba(0, 255, 179, 0.2)",
  color: "#00ffb3",
  fontSize: "0.7rem",
  fontWeight: 700,
  padding: "0.25rem 0.6rem",
  borderRadius: "6px",
  letterSpacing: "0.5px"
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#f8fafc",
  marginBottom: "0.75rem"
};

const cardDescStyle: React.CSSProperties = {
  fontSize: "0.92rem",
  color: "#94a3b8",
  lineHeight: "1.5",
  marginBottom: "1.5rem",
  flex: 1
};

const cardFooterStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#00ffb3",
  fontSize: "0.88rem",
  fontWeight: 600
};

const noResultsStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "3rem",
  color: "#64748b",
  fontSize: "1rem"
};

const moatBannerStyle: React.CSSProperties = {
  background: "rgba(0, 255, 179, 0.03)",
  border: "1px solid rgba(223, 186, 107, 0.15)",
  borderRadius: "16px",
  padding: "1.5rem 2rem",
  marginTop: "4rem"
};

const shieldIconContainerStyle: React.CSSProperties = {
  background: "rgba(0, 255, 179, 0.08)",
  border: "1px solid rgba(0, 255, 179, 0.2)",
  borderRadius: "12px",
  padding: "0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};
