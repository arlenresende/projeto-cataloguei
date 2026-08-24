import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Singleton do PrismaClient.
 *
 * Em desenvolvimento, o Next.js faz hot reload e cada request pode
 * recarregar módulos — sem o cache, isso abriria uma nova conexão a
 * cada vez e esgotaria o pool do banco rapidamente.
 *
 * O padrão abaixo reaproveita a instância em `globalThis`, que sobrevive
 * aos reloads do dev server, e cria uma nova em produção.
 *
 * Em Supabase + Prisma 7, a conexão de runtime usa o driver adapter
 * `@prisma/adapter-pg` apontando para a URL do pooler (porta 6543).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não está definida. Configure o .env.local com a connection string do Supabase."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
