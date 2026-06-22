"use client";

import React, { useState } from "react";

export default function CopyButton({ text, style }: { text: string; style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      style={{
        background: "rgba(0, 255, 208, 0.1)",
        border: "1px solid rgba(0, 255, 208, 0.2)",
        color: "#00ffd0",
        borderRadius: "4px",
        padding: "0.2rem 0.5rem",
        fontSize: "0.75rem",
        cursor: "pointer",
        marginLeft: "0.5rem",
        transition: "all 0.2s ease",
        ...style
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
