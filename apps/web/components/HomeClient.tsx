"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toolConstants from "../../../config/tool-constants.json";

function ToolGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get('q') || '';
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
    <div style={{ padding: "0 0 2rem 0" }}>
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

export default function HomeClient() {
  return (
    <Suspense fallback={<div>Loading tools...</div>}>
      <ToolGrid />
    </Suspense>
  );
}

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
