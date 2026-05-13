# ws-quasar-hono

POC monorepo — Quasar SSR (`@quasar/app-vite` v3 beta) + Hono RPC + Drizzle ORM + libSQL.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Quasar / Vue 3 (SSR) |
| Backend | Hono (mounted as SSR middleware) |
| Database | libSQL (file-based) + Drizzle ORM |
| Monorepo | pnpm workspaces + Moon |

## Getting started

### 1. Install dependencies

```bash
pnpm i
```

### 2. Run database migrations

```bash
pnpm --filter db db:migrate
```

### 3. Seed the database

```bash
pnpm --filter db db:seed
```

### 4. Start the dev server (SSR)

```bash
pnpm --filter frontend dev -m ssr
```

The app will be available at `http://localhost:9100`.  
The Scalar API reference is at `http://localhost:9100/scalar`.

## Project structure

```
apps/
  backend/        # Hono app — can run standalone or as SSR middleware
  frontend/       # Quasar SSR app
packages/
  db/             # Drizzle schema, migrations, and seed
  quasar/         # Quasar framework (git submodule)
```

## Useful commands

| Command | Description |
|---|---|
| `pnpm --filter backend dev` | Run Hono standalone on port 3000 |
| `pnpm --filter db db:studio` | Open Drizzle Studio |
| `pnpm --filter db db:generate` | Generate new migration after schema change |
