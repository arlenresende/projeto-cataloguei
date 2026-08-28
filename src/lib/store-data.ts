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
      },
      heroes: {
        where: { isActive: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!store) return null;

  // Extract WhatsApp number from URL (e.g. "https://wa.me/5511999999999" → "5511999999999")
  const whatsappNumber = store.whatsappUrl
    ? store.whatsappUrl.replace(/.*wa\.me\//, "").replace(/[^0-9]/g, "")
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
      alignment: h.alignment,
      buttonText: h.buttonText || "",
      buttonUrl: h.buttonUrl || "",
    })),
    products: store.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: Number(p.price),
      imageUrl: p.imageUrl || "/placeholder-product.svg",
      category: p.category || "Sem categoria",
    })),
  };
}

export type PublicStore = NonNullable<Awaited<ReturnType<typeof getPublicStoreBySlug>>>;
export type PublicProduct = PublicStore["products"][number];
export type PublicHero = PublicStore["heroes"][number];
