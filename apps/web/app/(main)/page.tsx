import React from "react";
import { Metadata } from "next";
import HomeClient from "../../components/HomeClient";

export const metadata: Metadata = {
  title: "NadirTools | Solitude Dark Labs Product Suite",
  description: "High-performance, client-side developer, sysadmin, and business utility engines optimized for speed and absolute privacy.",
  alternates: {
    canonical: "https://nadirtools.com",
  },
  openGraph: {
    title: "NadirTools | Solitude Dark Labs Product Suite",
    description: "High-performance, client-side developer, sysadmin, and business utility engines optimized for speed and absolute privacy.",
    url: "https://nadirtools.com",
    type: "website",
    siteName: "NadirTools",
  },
};

export default function HomePage() {
  return (
    <main>
      <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        NadirTools: Developer, Sysadmin, and Networking Utility Engines
      </h1>
      <HomeClient />
    </main>
  );
}
