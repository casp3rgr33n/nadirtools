"use client";

import React from "react";
import HeaderNav from "../../../../components/HeaderNav";
import AdUnit from "../../../../components/AdUnit";

export default function FormBuilderPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", width: "100%" }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          <a href="/" style={{ color: "#dfba6b", textDecoration: "none" }}>Home</a> /{" "}
          <span>Form Builder Pro</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", color: "#f8fafc", margin: "0 0 0.5rem 0" }}>
            Form Builder Pro
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: "1.6" }}>
            Create embeddable forms with drag-and-drop fields. Clean HTML — no iframes, no branding on Pro.
            Free tier includes 3 forms with unlimited fields.
          </p>
        </div>

        <AdUnit adSlot="3456789012" />

        {/* Embedded Form Builder SPA */}
        <div style={{
          border: "1px solid rgba(223, 186, 107, 0.15)",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "2rem 0",
          background: "#0a0f0a",
        }}>
          <iframe
            src="https://forms.log-lantern.com"
            style={{
              width: "100%",
              height: "800px",
              border: "none",
            }}
            title="Form Builder Pro"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        {/* Guides */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ color: "#f8fafc", fontSize: "1.5rem", marginBottom: "1rem" }}>
            📚 Guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <a href="/tools/form-builder/getting-started" style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(223, 186, 107, 0.1)",
              borderRadius: "8px",
              padding: "1.5rem",
              textDecoration: "none",
              color: "inherit",
            }}>
              <h3 style={{ color: "#dfba6b", margin: "0 0 0.5rem 0" }}>Getting Started</h3>
              <p style={{ color: "#94a3b8", margin: 0 }}>Create your first form, add fields, and get embed code.</p>
            </a>
            <a href="/tools/form-builder/best-practices" style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(223, 186, 107, 0.1)",
              borderRadius: "8px",
              padding: "1.5rem",
              textDecoration: "none",
              color: "inherit",
            }}>
              <h3 style={{ color: "#dfba6b", margin: "0 0 0.5rem 0" }}>Best Practices</h3>
              <p style={{ color: "#94a3b8", margin: 0 }}>Tips for creating forms that convert visitors into leads.</p>
            </a>
          </div>
        </div>

        {/* Embed Section */}
        <div style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "rgba(30, 41, 59, 0.3)",
          border: "1px solid rgba(223, 186, 107, 0.1)",
          borderRadius: "8px",
        }}>
          <h3 style={{ color: "#f8fafc", margin: "0 0 0.5rem 0" }}>
            🔗 Embed the Form Builder on your site
          </h3>
          <p style={{ color: "#94a3b8", margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
            Add the interactive builder to your own blog or documentation.
          </p>
          <textarea readOnly value={`<iframe src="https://nadirtools.com/embed/form-builder" width="100%" height="600" style="border:1px solid rgba(223, 186, 107, 0.2); border-radius:8px;" allowfullscreen></iframe>`}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#050705",
              border: "1px solid rgba(223, 186, 107, 0.2)",
              borderRadius: "6px",
              color: "#94a3b8",
              fontFamily: "monospace",
              fontSize: "0.8rem",
              resize: "vertical",
              minHeight: "60px",
            }}
          />
        </div>
      </div>
    </div>
  );
}