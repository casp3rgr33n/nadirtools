import React from "react";
import toolConstants from "../../../../../config/tool-constants.json";
import ToolWrapper from "../../../components/ToolWrapper";

interface PageProps {
  params: Promise<{
    toolSlug: string;
  }>;
}

export function generateStaticParams() {
  const tools = (toolConstants as any).tools;
  return Object.keys(tools).map((slug) => ({
    toolSlug: slug,
  }));
}

export default async function EmbedPage({ params }: PageProps) {
  const resolvedParams = await params;
  const toolSlug = resolvedParams.toolSlug;
  const tools = (toolConstants as any).tools;

  const tool = tools[toolSlug];

  if (!tool) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "#f43f5e" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Widget Not Found</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <ToolWrapper toolSlug={toolSlug} toolConfig={tool} />
    </div>
  );
}
