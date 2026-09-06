# DevOps, PM2 & Environment Codemap
# Target: Devin AI Assistant

## 1. Process Supervision (`ecosystem.config.js`)

The application processes are supervised using PM2 in production:

```javascript
module.exports = {
  apps: [
    {
      name: 'osis-strapi-backend',
      script: 'npm',
      args: 'run start',
      cwd: './strapi-cms',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
    {
      name: 'osis-next-frontend',
      script: 'npm',
      args: 'run start:solo',
      cwd: './osis-smait-fi',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
  ],
};
```

### Essential PM2 Commands
```bash
# Check running status
pm2 status

# Restart instances after code changes
pm2 restart osis-next-frontend
pm2 restart osis-strapi-backend

# View realtime logs
pm2 logs osis-next-frontend --lines 50
pm2 logs osis-strapi-backend --lines 50
```

---

## 2. Environment Variables Matrix

### A. Frontend (`osis-smait-fi/.env.local` / `.env`)
- `NEXT_PUBLIC_STRAPI_API_URL`: External Strapi URL (e.g., `https://osisstrapi.biezz.my.id`).
- `STRAPI_INTERNAL_URL`: Direct local network URL (e.g., `http://127.0.0.1:1337`).
- `STRAPI_API_TOKEN_MUBES`: Elevated read token for MUBES LPJ BFF queries.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk Public Key for client-side authentication.
- `CLERK_SECRET_KEY`: Clerk Secret Key for BFF server-side session checks.
- `CLERK_WEBHOOK_SECRET`: Secret signing key for Svix webhook verification.

### B. Backend (`strapi-cms/.env`)
- `HOST`: `0.0.0.0`
- `PORT`: `1337`
- `DATABASE_CLIENT`: `postgres`
- `DATABASE_HOST`: `127.0.0.1`
- `DATABASE_PORT`: `5433` (PostgreSQL Docker container `mubes-postgres`)
- `DATABASE_NAME`: `strapi`
- `DATABASE_USERNAME`: `strapi`
- `DATABASE_PASSWORD`: `***`
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`: Strapi security salts.

---

## 3. Development vs Production Command Cheatsheet

| Task | Development | Production (Solo / Monorepo) |
|---|---|---|
| Monorepo Dev | `npm run dev` (root) | - |
| Frontend Dev | `npm run dev:solo` in `./osis-smait-fi` | `npm run build` && `pm2 restart osis-next-frontend` |
| Strapi Dev | `npm run dev` in `./strapi-cms` | `npm run build` && `pm2 restart osis-strapi-backend` |
| Monorepo Build | `npm run build` (root) | - |
