import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const agentCard = {
    name: 'OSIS SMAIT Fithrah Insani Digital Agent (Agora Acta)',
    version: '1.0.0',
    description: 'Official AI agent interface for OSIS SMAIT Fithrah Insani student portal, event agendas, and public activities.',
    protocolVersion: '0.2.0',
    url: 'https://osissmaitfi.biezz.my.id/.well-known/agent-card.json',
    provider: {
      organization: 'OSIS SMAIT Fithrah Insani',
      url: 'https://osissmaitfi.biezz.my.id',
    },
    supportedInterfaces: [
      {
        url: 'https://osissmaitfi.biezz.my.id/api/a2a',
        protocol: 'json-rpc',
      },
    ],
    capabilities: {
      streaming: true,
      tool_use: true,
      context_awareness: true,
    },
    skills: [
      {
        id: 'get_events',
        name: 'Get Upcoming Events',
        description: 'Retrieve public events, agenda items, and school activity schedules managed by OSIS SMAIT Fithrah Insani.',
        parameters: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              description: 'Maximum number of events to fetch',
              default: 5,
            },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'past', 'all'],
              description: 'Filter events by schedule status',
              default: 'upcoming',
            },
          },
        },
      },
      {
        id: 'get_proker',
        name: 'Get Program Kerja (Proker)',
        description: 'Fetch official work programs and division agendas of OSIS SMAIT Fithrah Insani (Agora Acta).',
        parameters: {
          type: 'object',
          properties: {
            division: {
              type: 'string',
              description: 'Optional division name filter (e.g., BPH, Kestari, Humas, Keasramaan, etc.)',
            },
            status: {
              type: 'string',
              enum: ['planned', 'in_progress', 'completed', 'all'],
              description: 'Filter proker by execution status',
              default: 'all',
            },
          },
        },
      },
      {
        id: 'submit_aspirasi',
        name: 'Submit Student Aspirations',
        description: 'Submit student inquiries, suggestions, or critique securely into the OSIS Agora Acta student aspiration box.',
        parameters: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['fasilitas', 'kegiatan', 'akademik', 'keasramaan', 'umum'],
              description: 'Category of aspiration',
            },
            title: {
              type: 'string',
              description: 'Brief summary or headline of the aspiration',
            },
            message: {
              type: 'string',
              description: 'Detailed description of the aspiration or constructive feedback',
            },
            isAnonymous: {
              type: 'boolean',
              description: 'Flag indicating whether student identity should be withheld',
              default: true,
            },
          },
          required: ['category', 'title', 'message'],
        },
      },
    ],
    extensions: {
      ap2: {
        role: 'non-profit/community',
        category: 'education/student-body',
        compliance: {
          communityStandard: true,
          dataPrivacyPolicyUrl: 'https://osissmaitfi.biezz.my.id/privasi',
        },
      },
    },
  };

  return NextResponse.json(agentCard, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
