import React from "react";
import { Metadata } from "next";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Glossary & Core Concepts - NadirTools",
  description: "A comprehensive, high-quality glossary of developer, sysadmin, and networking terminology. Explained clearly for professionals.",
  alternates: {
    canonical: "https://nadirtools.com/glossary",
  },
};

export const revalidate = 3600; // Revalidate every hour to pick up newly "published" terms

export default async function GlossaryIndexPage() {
  // Only fetch terms that have a publishAt date in the past
  const terms = await prisma.glossaryTerm.findMany({
    where: {
      publishAt: {
        lte: new Date(),
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  // Group terms by category
  const categories = terms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {} as Record<string, typeof terms>);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Developer Glossary</h1>
        <p style={subtitleStyle}>
          Core concepts, definitions, and utilities for networking, databases, and software engineering.
        </p>
      </header>

      {Object.keys(categories).length === 0 ? (
        <section style={cardStyle}>
          <p style={pStyle}>No terms have been published yet. Check back soon!</p>
        </section>
      ) : (
        Object.entries(categories).map(([category, catTerms]) => (
          <section key={category} style={cardStyle}>
            <h2 style={sectionTitleStyle}>{category}</h2>
            <div style={gridStyle}>
              {catTerms.map((term) => (
                <Link key={term.id} href={`/glossary/${term.slug}`} style={termCardStyle}>
                  <h3 style={termTitleStyle}>{term.title}</h3>
                  <p style={termDefStyle}>{term.definition}</p>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "900px",
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
  fontSize: "1rem",
  lineHeight: "1.6",
};

const cardStyle: React.CSSProperties = {
  marginBottom: "3rem",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#dfba6b",
  marginBottom: "1.5rem",
  letterSpacing: "-0.3px",
  borderBottom: "1px solid rgba(223, 186, 107, 0.08)",
  paddingBottom: "0.5rem",
  display: "inline-block",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1.25rem",
};

const termCardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 12, 0.3)",
  border: "1px solid rgba(223, 186, 107, 0.08)",
  borderRadius: "12px",
  padding: "1.25rem",
  textDecoration: "none",
  transition: "all 0.2s ease-in-out",
  display: "flex",
  flexDirection: "column",
};

const termTitleStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#22c55e",
  marginBottom: "0.5rem",
};

const termDefStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "0.85rem",
  lineHeight: "1.5",
  margin: 0,
};

const pStyle: React.CSSProperties = {
  color: "#cbd5e1",
  lineHeight: "1.7",
  fontSize: "0.95rem",
};
