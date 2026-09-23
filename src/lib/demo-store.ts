import type { PublicStore } from "@/lib/store-data";

const now = new Date("2026-09-23T12:00:00.000Z");

const productImages = {
  necklace:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
  ring:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
  earrings:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  bag:
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  scarf:
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
  bracelet:
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  hero:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80",
};

export const DEMO_STORE_SLUG = "demo";

export const demoStore: PublicStore & {
  isDemo: true;
  analyticsEnabled: false;
  showCartActions: true;
} = {
  id: "demo-store",
  name: "Aurora Joias & Acessórios",
  slug: DEMO_STORE_SLUG,
  description:
    "Uma vitrine demonstrativa com joias delicadas e acessórios selecionados para mostrar como um catálogo online pode ficar no Cataloguei.",
  logo: null,
  whatsapp: "",
  theme: "FASHION",
  themeOverrides: {
    primaryColor: "#C8A24A",
    secondaryColor: "#111111",
  },
  hideCatalogueiBranding: false,
  email: "contato@aurorademo.com.br",
  phone: "(31) 99999-0000",
  address: "Rua das Flores, 120",
  city: "Belo Horizonte",
  state: "MG",
  postalCode: "30140-000",
  websiteUrl: "",
  instagramUrl: "https://instagram.com/cataloguei",
  facebookUrl: "",
  country: "BR",
  updatedAt: now,
  analyticsEnabled: false,
  isDemo: true,
  showCartActions: true,
  heroes: [
    {
      id: "demo-hero-1",
      title: "Coleção Aurora",
      description:
        "Joias minimalistas, bolsas elegantes e acessórios prontos para encantar no catálogo.",
      image: productImages.hero,
      bgColor: "#111111",
      textColor: "#FFFFFF",
      alignment: "LEFT",
      buttonText: "Ver produtos",
      buttonUrl: "#produtos",
      updatedAt: now,
    },
  ],
  categories: [
    {
      id: "demo-category-1",
      name: "Joias",
      slug: "joias",
      description: "Peças delicadas para compor looks elegantes.",
      updatedAt: now,
    },
    {
      id: "demo-category-2",
      name: "Bolsas",
      slug: "bolsas",
      description: "Modelos versáteis para rotina, eventos e presentes.",
      updatedAt: now,
    },
    {
      id: "demo-category-3",
      name: "Acessórios",
      slug: "acessorios",
      description: "Detalhes que valorizam a produção.",
      updatedAt: now,
    },
  ],
  products: [
    {
      id: "demo-product-1",
      name: "Colar Luz Dourada",
      slug: "colar-luz-dourada",
      description:
        "<p>Colar delicado com acabamento dourado e ponto de luz central. Ideal para usar sozinho ou em composição com outras correntes.</p>",
      seoTitle: "Colar Luz Dourada | Aurora Joias & Acessórios",
      seoDescription:
        "Colar dourado delicado com ponto de luz central na loja demo Aurora.",
      price: 149.9,
      compareAtPrice: 189.9,
      imageUrl: productImages.necklace,
      images: [productImages.necklace],
      category: "Joias",
      categoryId: "demo-category-1",
      categorySlug: "joias",
      brand: "Aurora",
      sku: "AUR-COL-001",
      stock: 12,
      featured: true,
      updatedAt: now,
    },
    {
      id: "demo-product-2",
      name: "Anel Solitário Classic",
      slug: "anel-solitario-classic",
      description:
        "<p>Anel com design clássico, banho dourado e pedra central brilhante para ocasiões especiais.</p>",
      seoTitle: "Anel Solitário Classic | Aurora Joias & Acessórios",
      seoDescription:
        "Anel solitário dourado com pedra central na loja demo Aurora.",
      price: 119.9,
      compareAtPrice: null,
      imageUrl: productImages.ring,
      images: [productImages.ring],
      category: "Joias",
      categoryId: "demo-category-1",
      categorySlug: "joias",
      brand: "Aurora",
      sku: "AUR-ANE-002",
      stock: 8,
      featured: true,
      updatedAt: now,
    },
    {
      id: "demo-product-3",
      name: "Brinco Pérola Essencial",
      slug: "brinco-perola-essencial",
      description:
        "<p>Brinco leve com pérola sintética e acabamento polido. Uma peça curinga para o dia a dia.</p>",
      seoTitle: "Brinco Pérola Essencial | Aurora Joias & Acessórios",
      seoDescription:
        "Brinco de pérola sintética com acabamento polido na loja demo Aurora.",
      price: 89.9,
      compareAtPrice: 109.9,
      imageUrl: productImages.earrings,
      images: [productImages.earrings],
      category: "Joias",
      categoryId: "demo-category-1",
      categorySlug: "joias",
      brand: "Aurora",
      sku: "AUR-BRI-003",
      stock: 18,
      featured: false,
      updatedAt: now,
    },
    {
      id: "demo-product-4",
      name: "Bolsa Estruturada Coral",
      slug: "bolsa-estruturada-coral",
      description:
        "<p>Bolsa estruturada com alça de mão e acabamento sofisticado. Perfeita para destacar produções neutras.</p>",
      seoTitle: "Bolsa Estruturada Coral | Aurora Joias & Acessórios",
      seoDescription:
        "Bolsa estruturada coral com acabamento elegante na loja demo Aurora.",
      price: 259.9,
      compareAtPrice: 319.9,
      imageUrl: productImages.bag,
      images: [productImages.bag],
      category: "Bolsas",
      categoryId: "demo-category-2",
      categorySlug: "bolsas",
      brand: "Aurora",
      sku: "AUR-BOL-004",
      stock: 5,
      featured: true,
      updatedAt: now,
    },
    {
      id: "demo-product-5",
      name: "Lenço Seda Urbana",
      slug: "lenco-seda-urbana",
      description:
        "<p>Lenço estampado com toque acetinado para usar no pescoço, cabelo ou na alça da bolsa.</p>",
      seoTitle: "Lenço Seda Urbana | Aurora Joias & Acessórios",
      seoDescription:
        "Lenço estampado com toque acetinado na loja demo Aurora.",
      price: 69.9,
      compareAtPrice: null,
      imageUrl: productImages.scarf,
      images: [productImages.scarf],
      category: "Acessórios",
      categoryId: "demo-category-3",
      categorySlug: "acessorios",
      brand: "Aurora",
      sku: "AUR-LEN-005",
      stock: 21,
      featured: false,
      updatedAt: now,
    },
    {
      id: "demo-product-6",
      name: "Pulseira Elos Finos",
      slug: "pulseira-elos-finos",
      description:
        "<p>Pulseira ajustável com elos finos e acabamento dourado. Combina com relógios e outras pulseiras.</p>",
      seoTitle: "Pulseira Elos Finos | Aurora Joias & Acessórios",
      seoDescription:
        "Pulseira ajustável com elos finos na loja demo Aurora.",
      price: 99.9,
      compareAtPrice: 129.9,
      imageUrl: productImages.bracelet,
      images: [productImages.bracelet],
      category: "Acessórios",
      categoryId: "demo-category-3",
      categorySlug: "acessorios",
      brand: "Aurora",
      sku: "AUR-PUL-006",
      stock: 14,
      featured: false,
      updatedAt: now,
    },
  ],
};

export function isDemoStoreSlug(slug: string) {
  return slug === DEMO_STORE_SLUG;
}
