import React from "react";

interface LegalDisclaimerProps {
  category: string;
}

export default function LegalDisclaimer({ category }: LegalDisclaimerProps) {
  let text = "";
  if (category === "finance") {
    text = "For informational and estimation purposes only. Not certified financial or tax advice. Cross-verify variables with a certified professional.";
  } else {
    text = "This utility provides generalized structural templates. It does not constitute legal representation or advice. No attorney-client relationship is created.";
  }

  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "8px",
        background: "rgba(239, 68, 68, 0.08)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        color: "#f87171",
        fontSize: "0.85rem",
        lineHeight: "1.4",
        margin: "1.5rem 0",
        fontFamily: "inherit"
      }}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <svg
          style={{ flexShrink: 0, marginTop: "0.15rem" }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          <strong>Disclaimer:</strong> {text}
        </span>
      </div>
    </div>
  );
}
