import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export async function GET() {
  // JWKS format according to IETF WebBotAuth Working Group and RFC 9421 / RFC 7517
  const jwks = {
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        kid: "osis-webbot-ed25519-2026a",
        use: "sig",
        alg: "EdDSA",
        x: "sP3_l_Q9tUaE5zH9w5y0qO1nC6bK7rW3mP8vT4uL2jA",
      },
      {
        kty: "RSA",
        kid: "osis-webbot-rsa-2026a",
        use: "sig",
        alg: "RS256",
        n: "w3yP8Z1nC6bK7rW3mP8vT4uL2jAsP3_l_Q9tUaE5zH9w5y0qO1nC6bK7rW3mP8vT4uL2jAsP3_l_Q9tUaE5zH9w5y0qO1nC6bK7rW3mP8vT4uL2jAsP3_l_Q9tUaE5zH9w5y0qO1nC6bK7rW3mP8vT4uL2jA",
        e: "AQAB",
      },
    ],
  };

  return NextResponse.json(jwks, {
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
