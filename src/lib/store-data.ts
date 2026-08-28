import { prisma } from "@/lib/prisma";
import type { StoreThemeSegment } from "@prisma/client";

/**
 * Fetches a store by its slug with products and active heroes, adapted
 * to the format the store components expect. Returns null if not found
 * or inactive.
 */
export async function getPublicStoreBySlug(slug: string) {
  const store = await prisma.store.findUnique({
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
    logo: store.logo || "/placeholder-logo.svg",
    whatsapp: whatsappNumber,
    theme: (store.themeStore || "DEFAULT") as StoreThemeSegment,
    email: store.email,
    phone: store.phoneNumber || store.cellPhone,
    address: store.address,
    city: store.city,
    state: store.state,
    postalCode: store.postalCode,
    websiteUrl: store.websiteUrl,
    instagramUrl: store.instagramUrl,
    facebookUrl: store.facebookUrl,
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
    })),
    categories: store.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
    })),
    products: store.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.descriptionHtml || "",
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      imageUrl: p.imageUrl || "/placeholder-product.svg",
      images: p.images.map((img) => img.url),
      category: p.categoryRel?.name || p.category || "Sem categoria",
      categoryId: p.categoryId,
      brand: p.brand || "",
      stock: p.stock,
      featured: p.featured,
    })),
  };
}

export type PublicStore = NonNullable<Awaited<ReturnType<typeof getPublicStoreBySlug>>>;
export type PublicProduct = PublicStore["products"][number];
export type PublicHero = PublicStore["heroes"][number];
