import { headers } from "next/headers";
import { DashboardContent } from "./dashboard-content";
import { auth } from "@/lib/auth";
import { getUserBillingState, serializeBillingState } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const billing = session
    ? serializeBillingState(await getUserBillingState(session.user.id))
    : null;

  const store = session
    ? await prisma.store.findUnique({
        where: { userId: session.user.id },
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          whatsappUrl: true,
          instagramUrl: true,
          facebookUrl: true,
          websiteUrl: true,
          logo: true,
          email: true,
          phoneNumber: true,
          cellPhone: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    : null;

  if (!store) {
    return (
      <DashboardContent
        billing={billing}
        stats={[
          { title: "Produtos", value: "0", subtitle: "Nenhuma loja criada" },
          { title: "Categorias", value: "0", subtitle: "Cadastre sua loja" },
          { title: "Banners ativos", value: "0", subtitle: "Cadastre sua loja" },
          { title: "Imagens", value: "0", subtitle: "Cadastre sua loja" },
        ]}
        catalog={null}
      />
    );
  }

  const weekStart = getStartOfWeek();
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    featuredProducts,
    productsCreatedThisWeek,
    outOfStockProducts,
    lowStockProducts,
    productsWithoutImage,
    categories,
    activeBanners,
    totalBanners,
    totalImages,
  ] = await Promise.all([
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.product.count({ where: { storeId: store.id, active: true } }),
    prisma.product.count({ where: { storeId: store.id, active: false } }),
    prisma.product.count({ where: { storeId: store.id, featured: true } }),
    prisma.product.count({
      where: { storeId: store.id, createdAt: { gte: weekStart } },
    }),
    prisma.product.count({ where: { storeId: store.id, stock: 0 } }),
    prisma.product.count({
      where: {
        storeId: store.id,
        stock: { gt: 0 },
        minStock: { not: null },
        AND: [{ stock: { lte: prisma.product.fields.minStock } }],
      },
    }),
    prisma.product.count({
      where: {
        storeId: store.id,
        imageUrl: null,
        images: { none: {} },
      },
    }),
    prisma.category.count({ where: { storeId: store.id } }),
    prisma.storeHero.count({ where: { storeId: store.id, isActive: true } }),
    prisma.storeHero.count({ where: { storeId: store.id } }),
    prisma.productImage.count({
      where: {
        product: {
          storeId: store.id,
        },
      },
    }),
  ]);

  const contactChannels = [
    store.whatsappUrl,
    store.instagramUrl,
    store.facebookUrl,
    store.websiteUrl,
    store.email,
    store.phoneNumber,
    store.cellPhone,
  ].filter(Boolean).length;
  const catalogHealthItems = [
    store.logo,
    store.whatsappUrl,
    categories > 0 ? "categories" : null,
    activeProducts > 0 ? "products" : null,
    activeBanners > 0 ? "banners" : null,
  ].filter(Boolean).length;
  const catalogHealth = Math.round((catalogHealthItems / 5) * 100);

  const stats = [
    {
      title: "Produtos",
      value: formatNumber(totalProducts),
      subtitle: `${formatNumber(activeProducts)} ativos · +${formatNumber(productsCreatedThisWeek)} esta semana`,
    },
    {
      title: "Estoque",
      value: formatNumber(outOfStockProducts + lowStockProducts),
      subtitle: `${formatNumber(outOfStockProducts)} zerados · ${formatNumber(lowStockProducts)} baixos`,
      dark: outOfStockProducts + lowStockProducts > 0,
    },
    {
      title: "Categorias",
      value: formatNumber(categories),
      subtitle: `${formatNumber(featuredProducts)} produtos em destaque`,
    },
    {
      title: "Imagens",
      value: formatNumber(totalImages),
      subtitle: `${formatNumber(productsWithoutImage)} produtos sem imagem`,
    },
  ];

  return (
    <DashboardContent
      stats={stats}
      billing={billing}
      catalog={{
        store: {
          name: store.name,
          slug: store.slug,
          isActive: store.isActive,
          updatedAt: store.updatedAt.toISOString(),
        },
        totals: {
          totalProducts,
          activeProducts,
          inactiveProducts,
          featuredProducts,
          productsCreatedThisWeek,
          outOfStockProducts,
          lowStockProducts,
          productsWithoutImage,
          categories,
          activeBanners,
          totalBanners,
          totalImages,
          contactChannels,
          catalogHealth,
        },
      }}
    />
  );
}
