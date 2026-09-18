import { NextRequest, NextResponse } from "next/server";

// Mock / placeholder endpoint for MCP transport (streamable-http / JSON-RPC 2.0)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    // Basic JSON-RPC 2.0 placeholder response
    const requestId = body?.id ?? null;
    const method = body?.method;

    if (method === "initialize") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: requestId,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
              resources: {},
              prompts: {},
            },
            serverInfo: {
              name: "osis-smait-fi-mcp",
              version: "1.0.0",
            },
          },
        },
        { status: 200 }
      );
    }

    if (method === "notifications/initialized") {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: requestId,
        result: {
          status: "connected",
          transport: "streamable-http",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error",
        },
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: "active",
      message: "OSIS SMAIT Fithrah Insani MCP HTTP Transport Endpoint",
      transport: "streamable-http",
      schema: "JSON-RPC 2.0",
    },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
