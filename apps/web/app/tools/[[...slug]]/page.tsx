import React from "react";
import toolConstants from "../../../../../config/tool-constants.json";
import ToolWrapper from "../../../components/ToolWrapper";
import SchemaRenderer from "../../../components/SchemaRenderer";

interface PageProps {
  params: {
    slug?: string[];
  };
}

// Pre-render all paths for static export
export function generateStaticParams() {
  const paths: { slug: string[] }[] = [];
  const tools = (toolConstants as any).tools;

  Object.keys(tools).forEach((toolKey) => {
    // Parent tool route: /tools/[toolSlug]
    paths.push({ slug: [toolKey] });

    // Child guide routes: /tools/[toolSlug]/[guideSlug]
    const guides = tools[toolKey].guides || {};
    Object.keys(guides).forEach((guideKey) => {
      paths.push({ slug: [toolKey, guideKey] });
    });
  });

  return paths;
}

export default function ToolCatchAllPage({ params }: PageProps) {
  const slug = params.slug || [];
  const tools = (toolConstants as any).tools;

  if (slug.length === 0) {
    // If someone visits /tools directly, redirect or show message
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "2rem" }}>Utility Tools Directory</h1>
        <p style={{ marginTop: "1rem" }}><a href="/">Return to Search Portal</a></p>
      </div>
    );
  }

  const toolSlug = slug[0];
  const tool = tools[toolSlug];

  if (!tool) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "2rem", color: "#f43f5e" }}>Tool Not Found</h1>
        <p style={{ marginTop: "1rem" }}><a href="/">Return to Search Portal</a></p>
      </div>
    );
  }

  const isGuidePage = slug.length > 1;

  if (isGuidePage) {
    const guideSlug = slug[1];
    const guide = tool.guides?.[guideSlug];

    if (!guide) {
      return (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <h1 style={{ fontSize: "2rem", color: "#f43f5e" }}>Guide Not Found</h1>
          <p style={{ marginTop: "1rem" }}><a href={`/tools/${toolSlug}`}>Back to {tool.name}</a></p>
        </div>
      );
    }

    // FAQs for schema (drawn from headings or math definitions)
    const faqs = [
      {
        question: `What is the core formula in ${guide.title}?`,
        answer: guide.summary
      }
    ];

    return (
      <div id="guide-root" style={layoutContainerStyle}>
        <SchemaRenderer
          toolName={guide.title}
          description={guide.summary}
          category={tool.category}
          url={`/tools/${toolSlug}/${guideSlug}`}
          faqs={faqs}
        />

        {/* Breadcrumbs */}
        <nav id="breadcrumbs" style={breadcrumbStyle}>
          <a href="/">Home</a> / <a href={`/tools/${toolSlug}`}>{tool.name}</a> / <span style={{ color: "#94a3b8" }}>{guide.title}</span>
        </nav>

        <div style={contentSplitterStyle}>
          {/* Main Article Content */}
          <article id="main-article" style={articleStyle}>
            <header id="article-header">
              <h1 id="article-title" style={articleTitleStyle}>{guide.title}</h1>
              <p id="article-summary" style={articleSummaryStyle}>{guide.summary}</p>
            </header>

            <div id="article-body" style={articleBodyStyle}>
              {guide.content.map((block: string, idx: number) => {
                if (block.startsWith("### ")) {
                  const title = block.replace("### ", "");
                  const blockId = `heading-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                  return (
                    <h3 key={idx} id={blockId} style={h3Style}>
                      {title}
                    </h3>
                  );
                }
                if (block.startsWith("#### ")) {
                  const title = block.replace("#### ", "");
                  const blockId = `heading-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                  return (
                    <h4 key={idx} id={blockId} style={h4Style}>
                      {title}
                    </h4>
                  );
                }
                if (block.startsWith("|")) {
                  // Render static table
                  return <RenderGuideTable key={idx} rawTable={block} />;
                }
                if (block.startsWith("`") && block.endsWith("`")) {
                  const code = block.replace(/`/g, "");
                  return (
                    <pre key={idx} style={preStyle}>
                      <code style={codeStyle}>{code}</code>
                    </pre>
                  );
                }
                const blockId = `p-${idx}`;
                return (
                  <p key={idx} id={blockId} style={pStyle}>
                    {block}
                  </p>
                );
              })}
            </div>

            <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
              <a href={`/tools/${toolSlug}`} style={backToToolBtnStyle}>
                ← Launch Interactive Calculator
              </a>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside id="sibling-sidebar" style={sidebarStyle}>
            <div style={sidebarStickyWrapperStyle}>
              <h4 style={sidebarHeaderStyle}>Related Guides</h4>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {Object.keys(tool.guides).map((gKey) => {
                  const g = tool.guides[gKey];
                  const isActive = gKey === guideSlug;
                  return (
                    <a
                      key={gKey}
                      href={`/tools/${toolSlug}/${gKey}`}
                      style={{
                        ...sidebarLinkStyle,
                        color: isActive ? "#60a5fa" : "#94a3b8",
                        background: isActive ? "rgba(96, 165, 250, 0.08)" : "transparent",
                        borderLeft: isActive ? "2px solid #60a5fa" : "2px solid transparent"
                      }}
                    >
                      {g.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Otherwise, it is the parent tool page
  return (
    <div id="tool-root">
      <SchemaRenderer
        toolName={tool.name}
        description={tool.description}
        category={tool.category}
        url={`/tools/${toolSlug}`}
      />

      <nav id="breadcrumbs" style={breadcrumbStyle}>
        <a href="/">Home</a> / <span style={{ color: "#94a3b8" }}>{tool.name}</span>
      </nav>

      <div style={contentSplitterStyle}>
        {/* Main Interactive Tool */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ToolWrapper toolSlug={toolSlug} toolConfig={tool} />
        </div>

        {/* Side Panel linking to Guides */}
        <aside id="guides-sidebar" style={sidebarStyle}>
          <div style={sidebarStickyWrapperStyle}>
            <h4 style={sidebarHeaderStyle}>Technical & Math Guides</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.keys(tool.guides || {}).map((gKey) => {
                const g = tool.guides[gKey];
                return (
                  <a key={gKey} href={`/tools/${toolSlug}/${gKey}`} style={guideCardStyle}>
                    <h5 style={guideCardTitleStyle}>{g.title}</h5>
                    <p style={guideCardDescStyle}>{g.summary}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Component to render static markdown tables from JSON config strings
function RenderGuideTable({ rawTable }: { rawTable: string }) {
  const rows = rawTable.trim().split("\n");
  const parsedRows = rows.map((row) =>
    row
      .split("|")
      .map((cell) => cell.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
  );

  // Filter out the header-separator row: |---|---|
  const tableData = parsedRows.filter((row) => !row.every((cell) => cell.startsWith("---") || cell === ""));

  if (tableData.length === 0) return null;

  const headers = tableData[0];
  const bodyRows = tableData.slice(1);

  return (
    <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
      <table style={guideTableStyle}>
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
            {headers.map((h, i) => (
              <th key={i} style={guideThStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={guideTdStyle}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==========================================================================
   Styles
   ========================================================================== */
const layoutContainerStyle: React.CSSProperties = {
  padding: "1rem 0"
};

const breadcrumbStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "#64748b",
  marginBottom: "2rem",
  display: "flex",
  gap: "0.5rem"
};

const contentSplitterStyle: React.CSSProperties = {
  display: "flex",
  gap: "3rem",
  flexWrap: "wrap-reverse",
  alignItems: "flex-start"
};

const articleStyle: React.CSSProperties = {
  flex: "2 1 600px",
  minWidth: 0,
  background: "rgba(30, 41, 59, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.03)",
  borderRadius: "16px",
  padding: "2.5rem",
  boxShadow: "0 4px 30px rgba(0,0,0,0.15)"
};

const sidebarStyle: React.CSSProperties = {
  flex: "1 1 300px",
  position: "sticky",
  top: "100px"
};

const sidebarStickyWrapperStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "16px",
  padding: "1.5rem"
};

const sidebarHeaderStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "#f8fafc",
  marginBottom: "1.25rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid rgba(255,255,255,0.05)"
};

const sidebarLinkStyle: React.CSSProperties = {
  display: "block",
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  fontSize: "0.9rem",
  textDecoration: "none",
  transition: "all 0.2s ease"
};

const guideCardStyle: React.CSSProperties = {
  display: "block",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  padding: "1.25rem",
  textDecoration: "none",
  transition: "all 0.2s ease",
  cursor: "pointer"
};

const guideCardTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#f8fafc",
  marginBottom: "0.5rem"
};

const guideCardDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  lineHeight: "1.4"
};

const articleTitleStyle: React.CSSProperties = {
  fontSize: "2.25rem",
  fontWeight: 800,
  letterSpacing: "-0.5px",
  color: "#f8fafc",
  lineHeight: "1.2",
  marginBottom: "1rem"
};

const articleSummaryStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
};

const articleBodyStyle: React.CSSProperties = {
  fontSize: "1.05rem",
  lineHeight: "1.75",
  color: "#cbd5e1"
};

const h3Style: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "#f1f5f9",
  marginTop: "2.5rem",
  marginBottom: "1rem"
};

const h4Style: React.CSSProperties = {
  fontSize: "1.15rem",
  fontWeight: 600,
  color: "#e2e8f0",
  marginTop: "2rem",
  marginBottom: "0.75rem"
};

const pStyle: React.CSSProperties = {
  marginBottom: "1.5rem"
};

const preStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
  padding: "1rem 1.25rem",
  overflowX: "auto",
  marginBottom: "1.5rem"
};

const codeStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#93c5fd"
};

const backToToolBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#1e293b",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "0.75rem 1.25rem",
  color: "#f8fafc",
  fontWeight: 600,
  fontSize: "0.9rem",
  transition: "all 0.2s ease"
};

const guideTableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem"
};

const guideThStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#94a3b8",
  fontWeight: 600,
  textAlign: "left"
};

const guideTdStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  color: "#cbd5e1"
};
