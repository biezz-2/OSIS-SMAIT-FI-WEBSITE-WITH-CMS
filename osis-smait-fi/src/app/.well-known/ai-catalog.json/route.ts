import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const aiCatalog = {
    specVersion: '1.0.0',
    version: '1.0.0',
    hostIdentifier: 'osissmaitfi.biezz.my.id',
    hostDisplayName: 'OSIS SMAIT Fithrah Insani (Agora Acta)',
    title: 'OSIS SMAIT Fithrah Insani AI Catalog',
    description: 'Agent Resource Discovery (ARD) manifest for OSIS SMAIT Fithrah Insani (Agora Acta).',
    endpoints: {
      a2a: 'https://osissmaitfi.biezz.my.id/api/a2a',
      mcp: 'https://osissmaitfi.biezz.my.id/api/mcp',
      api_catalog: 'https://osissmaitfi.biezz.my.id/.well-known/api-catalog',
      openapi: 'https://osissmaitfi.biezz.my.id/openapi.json',
      auth: 'https://osissmaitfi.biezz.my.id/auth.md',
    },
    entries: [
      {
        identifier: 'urn:ard:osissmaitfi:events',
        displayName: 'School Events and Agendas',
        id: 'school_events',
        type: 'api',
        name: 'School Events and Agendas',
        description: 'Query upcoming academic events, competitions, and extracurricular calendars.',
        url: 'https://osissmaitfi.biezz.my.id/api/events',
      },
      {
        identifier: 'urn:ard:osissmaitfi:proker',
        displayName: 'OSIS Work Programs (Proker)',
        id: 'work_programs',
        type: 'api',
        name: 'OSIS Work Programs (Proker)',
        description: 'Access student council work programs and department agendas.',
        url: 'https://osissmaitfi.biezz.my.id/api/program-kerja',
      },
      {
        identifier: 'urn:ard:osissmaitfi:aspirasi',
        displayName: 'Student Aspirations Box',
        id: 'aspirations',
        type: 'api',
        name: 'Student Aspirations Box',
        description: 'Submit feedback and student aspirations directly to the student council.',
        url: 'https://osissmaitfi.biezz.my.id/api/inbox',
      },
      {
        identifier: 'urn:ard:osissmaitfi:mcp',
        displayName: 'MCP Server',
        id: 'mcp_service',
        type: 'service',
        name: 'MCP Server',
        description: 'Model Context Protocol server endpoint for OSIS SMAIT FI.',
        url: 'https://osissmaitfi.biezz.my.id/api/mcp',
      },
      {
        identifier: 'urn:ard:osissmaitfi:a2a',
        displayName: 'A2A Agent Endpoint',
        id: 'a2a_agent',
        type: 'agent',
        name: 'A2A Agent Endpoint',
        description: 'Agent-to-Agent protocol v0.2.0 interface for OSIS SMAIT FI.',
        url: 'https://osissmaitfi.biezz.my.id/api/a2a',
      },
    ],
    capabilities: [
      {
        id: 'school_events',
        type: 'query',
        name: 'School Events and Agendas',
        description: 'Query upcoming academic events, competitions, and extracurricular calendars.',
        url: 'https://osissmaitfi.biezz.my.id/api/events',
      },
      {
        id: 'work_programs',
        type: 'query',
        name: 'OSIS Work Programs (Proker)',
        description: 'Access student council work programs and department agendas.',
        url: 'https://osissmaitfi.biezz.my.id/api/program-kerja',
      },
      {
        id: 'aspirations',
        type: 'action',
        name: 'Student Aspirations Box',
        description: 'Submit feedback and student aspirations directly to the student council.',
        url: 'https://osissmaitfi.biezz.my.id/api/inbox',
      },
    ],
  };

  return NextResponse.json(aiCatalog, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
