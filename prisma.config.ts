import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Carrega .env e .env.local (ordem: .env.local sobrescreve .env).
// O Prisma CLI não lê .env.local automaticamente, então precisamos
// carregar manualmente para o `prisma migrate` e `prisma db seed`.
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

/**
 * Configuração do Prisma CLI (migrations, generate, seed).
 *
 * Em Supabase, `prisma migrate` precisa de uma conexão DIRETA (porta 5432),
 * sem pgbouncer — por isso apontamos `datasource.url` para `DIRECT_URL`,
 * com fallback para `DATABASE_URL` se a direta não estiver definida.
 *
 * Em runtime, o `PrismaClient` em `src/lib/prisma.ts` usa o pooler
 * (`DATABASE_URL` com `?pgbouncer=true`) via driver adapter.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
