import type { Core } from '@strapi/strapi';

const config = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  documents: {
    strictParams: true,
  },
} as any;

export default config;
