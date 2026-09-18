import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function GET() {
  const serverCard = {
    serverInfo: {
      name: "osis-smait-fi-mcp",
      version: "1.0.0",
      description: "Model Context Protocol server for OSIS SMAIT Fithrah Insani",
    },
    endpoint: "https://osissmaitfi.biezz.my.id/api/mcp",
    transport: "streamable-http",
    capabilities: {
      tools: { listChanged: false },
      resources: { subscribe: false },
      prompts: { listChanged: false },
    },
  };

  return NextResponse.json(serverCard, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
