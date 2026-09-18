'use client';

import { useEffect } from 'react';

// Declarations for WebMCP W3C / Chrome Model Context Tool API
export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface ModelContextRegistry {
  registerTool: (tool: WebMcpToolDefinition) => void;
  unregisterTool?: (name: string) => void;
  getTools?: () => WebMcpToolDefinition[];
  executeTool?: (name: string, params: any) => Promise<any>;
}

declare global {
  interface Navigator {
    modelContext?: ModelContextRegistry;
  }
}

export default function WebMcpProvider() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    // 1. Initialize native or polyfill / mock registry
    if (!navigator.modelContext) {
      const toolsMap = new Map<string, WebMcpToolDefinition>();

      const mockRegistry: ModelContextRegistry = {
        registerTool: (tool: WebMcpToolDefinition) => {
          toolsMap.set(tool.name, tool);
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[WebMCP] Tool registered: ${tool.name}`);
          }
        },
        unregisterTool: (name: string) => {
          toolsMap.delete(name);
        },
        getTools: () => {
          return Array.from(toolsMap.values());
        },
        executeTool: async (name: string, params: any) => {
          const tool = toolsMap.get(name);
          if (!tool) throw new Error(`Tool ${name} not found in WebMCP registry`);
          return await tool.execute(params);
        },
      };

      try {
        Object.defineProperty(navigator, 'modelContext', {
          value: mockRegistry,
          writable: true,
          configurable: true,
        });
      } catch (err) {
        // Fallback direct assignment if defineProperty fails
        (navigator as any).modelContext = mockRegistry;
      }
    }

    if (!navigator.modelContext || typeof navigator.modelContext.registerTool !== 'function') return;

    // 2. Register search_osis_content tool
    navigator.modelContext.registerTool({
      name: 'search_osis_content',
      description: 'Search news, work programs, and events in OSIS SMAIT FI',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Keyword pencarian (contoh: event, sekbid, visi, proker, nama pengurus)',
          },
        },
        required: ['query'],
      },
      execute: async (params: { query?: string }) => {
        const query = params?.query?.trim() || '';
        if (!query) {
          return { status: 'empty', results: [] };
        }

        try {
          const res = await fetch(`/api/webmcp/search?q=${encodeURIComponent(query)}`);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          return {
            status: 'success',
            query,
            count: data.results?.length || 0,
            results: data.results || [],
          };
        } catch (err: any) {
          console.warn('[WebMCP] search_osis_content error:', err);
          return {
            status: 'error',
            message: err?.message || 'Failed to search OSIS content',
            results: [],
          };
        }
      },
    });

    // 3. Register get_contact_info tool
    navigator.modelContext.registerTool({
      name: 'get_contact_info',
      description: 'Get official contact and social media channels of OSIS SMAIT FI',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        return {
          organization: 'OSIS SMAIT Fithrah Insani (Agora Acta)',
          period: '2025 - 2026',
          address: 'SMAIT Fithrah Insani, Jl. H. Gofur No. 10 Tanimulya, Ngamprah, Kab. Bandung Barat, Jawa Barat 40552',
          phone: '(022) 87808984',
          email: 'osissmaitfi@gmail.com',
          website: 'https://osissmaitfi.biezz.my.id',
          socialMedia: [
            {
              platform: 'Instagram',
              handle: '@osissmaitfi',
              url: 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ==',
            },
            {
              platform: 'YouTube',
              channel: 'OSIS SMAIT Fithrah Insani',
              url: 'https://www.youtube.com/@osissmaitfithrahinsani9481',
            },
            {
              platform: 'TikTok',
              handle: '@osissmaitfi',
              url: 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z',
            },
          ],
        };
      },
    });
  }, []);

  return null;
}
