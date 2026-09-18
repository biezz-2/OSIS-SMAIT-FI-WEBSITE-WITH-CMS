import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { EVENTS_SKILL_CONTENT } from "../browse-events/SKILL.md/route";
import { PROKER_SKILL_CONTENT } from "../browse-proker/SKILL.md/route";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

function computeSha256(content: string): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

export async function GET() {
  const eventsDigest = computeSha256(EVENTS_SKILL_CONTENT);
  const prokerDigest = computeSha256(PROKER_SKILL_CONTENT);

  const discoveryIndex = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "browse-events",
        type: "skill-md",
        description: "Retrieve and query upcoming school events, agendas, and competitions at SMAIT Fithrah Insani.",
        url: "https://osissmaitfi.biezz.my.id/.well-known/agent-skills/browse-events/SKILL.md",
        digest: eventsDigest,
      },
      {
        name: "browse-proker",
        type: "skill-md",
        description: "Explore work programs (program kerja) and student council department details.",
        url: "https://osissmaitfi.biezz.my.id/.well-known/agent-skills/browse-proker/SKILL.md",
        digest: prokerDigest,
      },
    ],
  };

  return NextResponse.json(discoveryIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
