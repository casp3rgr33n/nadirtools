import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";
import { marked } from "marked";

// Revalidate every hour so scheduled posts go live naturally
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const term = await prisma.glossaryTerm.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!term || term.publishAt > new Date()) {
    return { title: "Term Not Found" };
  }

  return {
    title: `${term.title} - Definition & Utility | NadirTools`,
    description: term.definition,
    alternates: {
      canonical: `https://nadirtools.com/glossary/${term.slug}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const term = await prisma.glossaryTerm.findUnique({
    where: { slug: resolvedParams.slug },
  });

  // DRIP PUBLISHING LOGIC: If term doesn't exist OR publish date is in the future, return 404!
  if (!term || term.publishAt > new Date()) {
    notFound();
  }

  const htmlContent = marked.parse(term.markdown);

  return (
    <div style={containerStyle}>
      <Link href="/glossary" style={backLinkStyle}>
        ← Back to Glossary
      </Link>
      
      <header style={headerStyle}>
        <div style={tagStyle}>{term.category}</div>
        <h1 style={titleStyle}>{term.title}</h1>
        <p style={subtitleStyle}>{term.definition}</p>
      </header>

      <section style={cardStyle}>
        <div 
          style={contentStyle} 
          className="prose prose-invert max-w-none prose-a:text-green-500"
          dangerouslySetInnerHTML={{ __html: htmlContent as string }} 
        />
      </section>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "name": term.title,
            "description": term.definition,
            "inDefinedTermSet": "https://nadirtools.com/glossary",
            "url": `https://nadirtools.com/glossary/${term.slug}`
          })
        }}
      />
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "1rem 0 4rem 0",
};

const backLinkStyle: React.CSSProperties = {
  display: "inline-block",
  color: "#64748b",
  textDecoration: "none",
  marginBottom: "2rem",
  fontSize: "0.9rem",
  transition: "color 0.2s",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "3rem",
  borderBottom: "1px solid rgba(223, 186, 107, 0.12)",
  paddingBottom: "2rem",
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(34, 197, 94, 0.1)",
  color: "#22c55e",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: "1rem",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.75rem",
  fontWeight: 800,
  color: "#f8fafc",
  marginBottom: "1rem",
  lineHeight: "1.1",
};

const subtitleStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "1.1rem",
  lineHeight: "1.6",
  fontWeight: 400,
};

const cardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 12, 0.3)",
  border: "1px solid rgba(223, 186, 107, 0.08)",
  borderRadius: "16px",
  padding: "2.5rem",
  boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
};

const contentStyle: React.CSSProperties = {
  color: "#cbd5e1",
  lineHeight: "1.8",
  fontSize: "1rem",
};
