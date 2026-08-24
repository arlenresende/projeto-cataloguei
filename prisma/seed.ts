/**
 * Seed de desenvolvimento - Cataloguei
 *
 * Cria uma loja fictícia completa (TechStore) com usuário owner
 * e catálogo de produtos, usando `upsert` para ser reproduzível
 * (rodar o seed múltiplas vezes não duplica dados).
 *
 * Como rodar:
 *   npm run db:seed
 *
 * Dados criados:
 *   - User:  dev@cataloguei.com (Arlen Dev)
 *   - Store: techstore (segmento TECHNOLOGY)
 *   - 6 produtos com categorias variadas
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local", override: true });
loadEnv({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL não definida. Configure o .env.local antes de rodar o seed."
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // User owner
  const owner = await prisma.user.upsert({
    where: { email: "dev@cataloguei.com" },
    update: {},
    create: {
      name: "Arlen Dev",
      email: "dev@cataloguei.com",
      emailVerified: true,
      image: "/placeholder-logo.svg",
    },
  });
  console.log(`✓ User: ${owner.name} (${owner.email})`);

  // Store
  const store = await prisma.store.upsert({
    where: { url: "techstore" },
    update: {},
    create: {
      name: "TechStore",
      url: "techstore",
      description:
        "Sua loja de tecnologia com os melhores produtos e preços do mercado.",
      logoUrl: "/placeholder-logo.svg",
      bannerUrl: "/placeholder-banner.svg",
      whatsapp: "5511999999999",
      theme: "TECHNOLOGY",
      ownerId: owner.id,
    },
  });
  console.log(`✓ Store: ${store.name} (/${store.url})`);

  // Produtos — usa upsert por (storeId, name) não é trivial,
  // então primeiro remove os existentes e recria para manter
  // o seed determinístico e simples.
  await prisma.product.deleteMany({ where: { storeId: store.id } });

  const productsData = [
    {
      name: "Fone Bluetooth Pro",
      description:
        "Fone de ouvido sem fio com cancelamento de ruído ativo e bateria de 30h.",
      price: "299.90",
      imageUrl: "/placeholder-product.svg",
      category: "Eletrônicos",
    },
    {
      name: "Capa Silicone Premium",
      description:
        "Capa de silicone de alta qualidade com proteção contra quedas.",
      price: "49.90",
      imageUrl: "/placeholder-product.svg",
      category: "Acessórios",
    },
    {
      name: "Carregador Turbo 65W",
      description:
        "Carregador rápido compatível com múltiplos dispositivos USB-C.",
      price: "129.90",
      imageUrl: "/placeholder-product.svg",
      category: "Eletrônicos",
    },
    {
      name: "Suporte para Notebook",
      description:
        "Suporte ergonômico em alumínio ajustável para notebooks de até 17 polegadas.",
      price: "189.90",
      imageUrl: "/placeholder-product.svg",
      category: "Acessórios",
    },
    {
      name: "Mouse Sem Fio Ergonômico",
      description:
        "Mouse ergonômico com sensor de alta precisão e bateria recarregável.",
      price: "159.90",
      imageUrl: "/placeholder-product.svg",
      category: "Periféricos",
    },
    {
      name: "Teclado Mecânico RGB",
      description:
        "Teclado mecânico com switches hot-swappable e iluminação RGB personalizável.",
      price: "349.90",
      imageUrl: "/placeholder-product.svg",
      category: "Periféricos",
    },
  ];

  await prisma.product.createMany({
    data: productsData.map((p) => ({ ...p, storeId: store.id })),
  });
  console.log(`✓ Products: ${productsData.length} itens criados`);

  // Resumo
  const totals = {
    users: await prisma.user.count(),
    stores: await prisma.store.count(),
    products: await prisma.product.count(),
  };
  console.log("\n📊 Banco de dados:");
  console.table(totals);
  console.log("\n✅ Seed concluído com sucesso.");
}

main()
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
