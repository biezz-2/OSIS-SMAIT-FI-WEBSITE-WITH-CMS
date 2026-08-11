import type { Core, Data } from '@strapi/types';
import type { Ability } from '@casl/ability';
import type { Context } from 'koa';
export type McpAdminTokenAbility = Ability;
export type McpAuthFailureReason = 'missing_token' | 'invalid_token';
export type McpAdminTokenAuthResult = {
    authenticated: false;
    reason: McpAuthFailureReason;
    error?: Error;
} | {
    authenticated: true;
    credentials: {
        id: Data.ID;
    };
    user: {
        id: Data.ID;
    };
    ability: McpAdminTokenAbility;
};
export declare const createMcpAdminTokenAuthenticator: (strapi: Core.Strapi) => {
    authenticate(ctx: Context): Promise<McpAdminTokenAuthResult>;
};
//# sourceMappingURL=authentication.d.ts.map