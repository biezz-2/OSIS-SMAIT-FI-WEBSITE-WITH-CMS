const extractBearerToken = (ctx)=>{
    const authorization = ctx.request.header.authorization;
    if (authorization === undefined) {
        return null;
    }
    const parts = authorization.split(/\s+/);
    if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return null;
    }
    return parts[1];
};
const createMcpAdminTokenAuthenticator = (strapi)=>({
        async authenticate (ctx) {
            const token = extractBearerToken(ctx);
            if (token === null) {
                return {
                    authenticated: false,
                    reason: 'missing_token'
                };
            }
            const authResult = await strapi.admin.services['api-token-admin'].authenticateAdminToken(token);
            if (authResult.authenticated === false) {
                return {
                    authenticated: false,
                    reason: 'invalid_token',
                    error: authResult.error
                };
            }
            return {
                authenticated: true,
                credentials: {
                    id: authResult.credentials.id
                },
                user: {
                    id: authResult.user.id
                },
                ability: authResult.ability
            };
        }
    });

export { createMcpAdminTokenAuthenticator };
//# sourceMappingURL=authentication.mjs.map
