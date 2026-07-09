import React from "react";

export default function EmbedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundColor: "#050705",
      backgroundImage: "radial-gradient(circle at 50% -20%, #17202a 0%, #050705 70%)",
      padding: "1rem",
      boxSizing: "border-box",
      margin: 0
    }}>
      {children}
    </div>
  );
}
