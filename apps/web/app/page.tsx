import React from "react";
import { Metadata } from "next";
import HomeClient from "../components/HomeClient";

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
  return <HomeClient />;
}
