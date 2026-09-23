import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { StoreThemeSegment } from "@prisma/client";
import { demoStore, isDemoStoreSlug } from "@/lib/demo-store";

export type PublicStore = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  whatsapp: string;
  theme: StoreThemeSegment;
  themeOverrides: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  hideCatalogueiBranding: boolean;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  country: string | null;
  updatedAt: Date;
  analyticsEnabled?: boolean;
  isDemo?: boolean;
  showCartActions?: boolean;
  heroes: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    bgColor: string;
    textColor: string;
    alignment: "LEFT" | "CENTER" | "RIGHT";
    buttonText: string;
    buttonUrl: string;
    updatedAt: Date;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    updatedAt: Date;
  }>;
  products: Array<{
    id: string;
    name: string;
    slug: string | null;
    description: string;
    seoTitle: string | null;
    seoDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string | null;
    images: string[];
    category: string;
    categoryId: string | null;
    categorySlug: string | null;
    brand: string;
    sku: string | null;
    stock: number;
    featured: boolean;
    updatedAt: Date;
  }>;
};

/**
 * Fetches a store by its slug with products and active heroes, adapted
 * to the format the store components expect. Returns null if not found
 * or inactive.
 */
const getPublicStoreRecordBySlug = cache(async (slug: string) => {
  return prisma.store.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { active: true },
        orderBy: { position: "asc" },
        include: {
          images: { orderBy: { position: "asc" } },
          categoryRel: { select: { id: true, name: true, slug: true } },
        },
      },
      heroes: {
        where: { isActive: true },
        orderBy: { position: "asc" },
      },
      categories: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });
});

export const getPublicStoreBySlug = cache(async (slug: string): Promise<PublicStore | null> => {
  if (isDemoStoreSlug(slug)) {
    return demoStore;
  }

  const store = await getPublicStoreRecordBySlug(slug);

  if (!store) return null;

  // WhatsApp: stored as digits, extract number for links
  // Handles both legacy URL format and new digit-only format
  const whatsappNumber = store.whatsappUrl
    ? store.whatsappUrl.replace(/[^0-9]/g, "")
    : "";

  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    description: store.description || "",
    logo: store.logo,
    whatsapp: whatsappNumber,
    theme: (store.themeStore || "DEFAULT") as StoreThemeSegment,
    themeOverrides: {
      primaryColor: store.primaryColor || undefined,
      secondaryColor: store.secondaryColor || undefined,
    },
    hideCatalogueiBranding: store.hideCatalogueiBranding,
    email: store.email,
    phone: store.phoneNumber || store.cellPhone,
    address: store.address,
    city: store.city,
    state: store.state,
    postalCode: store.postalCode,
    websiteUrl: store.websiteUrl,
    instagramUrl: store.instagramUrl,
    facebookUrl: store.facebookUrl,
    country: store.country,
    updatedAt: store.updatedAt,
    heroes: store.heroes.map((h) => ({
      id: h.id,
      title: h.title,
      description: h.description || "",
      image: h.image || "",
      bgColor: h.bgColor || "",
      textColor: h.textColor || "",
      alignment: h.alignment,
      buttonText: h.buttonText || "",
      buttonUrl: h.buttonUrl || "",
      updatedAt: h.updatedAt,
    })),
    categories: store.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      updatedAt: c.updatedAt,
    })),
    products: store.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.descriptionHtml || "",
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      imageUrl: p.imageUrl,
      images: p.images.map((img) => img.url),
      category: p.categoryRel?.name || p.category || "Sem categoria",
      categoryId: p.categoryId,
      categorySlug: p.categoryRel?.slug || null,
      brand: p.brand || "",
      sku: p.sku || null,
      stock: p.stock,
      featured: p.featured,
      updatedAt: p.updatedAt,
    })),
  };
});

export const getPublicCategoryBySlug = cache(
  async (storeSlug: string, categorySlug: string) => {
    const store = await getPublicStoreBySlug(storeSlug);

    if (!store) {
      return null;
    }

    const category = store.categories.find((item) => item.slug === categorySlug);

    if (!category) {
      return null;
    }

    const products = store.products.filter(
      (product) =>
        product.categorySlug === category.slug || product.category === category.name
    );

    return {
      store,
      category,
      products,
    };
  }
);

export const getPublicProductByIdentifier = cache(
  async (storeSlug: string, identifier: string) => {
    const store = await getPublicStoreBySlug(storeSlug);

    if (!store) {
      return null;
    }

    const product = store.products.find(
      (item) => item.slug === identifier || item.id === identifier
    );

    if (!product) {
      return null;
    }

    return {
      store,
      product,
    };
  }
);

export const getPublicLinktreeByStoreSlug = cache(async (storeSlug: string) => {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug, isActive: true },
    select: {
      id: true,
      userId: true,
      name: true,
      slug: true,
      logo: true,
      updatedAt: true,
    },
  });

  if (!store) {
    return null;
  }

  const linktree = await prisma.linktree.findUnique({
    where: { userId: store.userId },
    include: { links: { orderBy: { order: "asc" } } },
  });

  if (!linktree) {
    return null;
  }

  return {
    store,
    linktree,
  };
});

export type PublicProduct = PublicStore["products"][number];
export type PublicHero = PublicStore["heroes"][number];
