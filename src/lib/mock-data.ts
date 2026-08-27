import type { Store, Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fone Bluetooth Pro",
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo e bateria de 30h.",
    price: 299.9,
    imageUrl: "/placeholder-product.svg",
    category: "Eletrônicos",
  },
  {
    id: "2",
    name: "Capa Silicone Premium",
    description: "Capa de silicone de alta qualidade com proteção contra quedas.",
    price: 49.9,
    imageUrl: "/placeholder-product.svg",
    category: "Acessórios",
  },
  {
    id: "3",
    name: "Carregador Turbo 65W",
    description: "Carregador rápido compatível com múltiplos dispositivos.",
    price: 129.9,
    imageUrl: "/placeholder-product.svg",
    category: "Eletrônicos",
  },
  {
    id: "4",
    name: "Suporte para Notebook",
    description: "Suporte ergonômico em alumínio ajustável para notebooks de até 17 polegadas.",
    price: 189.9,
    imageUrl: "/placeholder-product.svg",
    category: "Acessórios",
  },
  {
    id: "5",
    name: "Mouse Sem Fio Ergonômico",
    description: "Mouse ergonômico com sensor de alta precisão e bateria recarregável.",
    price: 159.9,
    imageUrl: "/placeholder-product.svg",
    category: "Periféricos",
  },
  {
    id: "6",
    name: "Teclado Mecânico RGB",
    description: "Teclado mecânico com switches hot-swappable e iluminação RGB personalizável.",
    price: 349.9,
    imageUrl: "/placeholder-product.svg",
    category: "Periféricos",
  },
];

export const mockStores: Store[] = [
  {
    id: "1",
    name: "TechStore",
    url: "techstore",
    description: "Sua loja de tecnologia com os melhores produtos e preços.",
    logoUrl: "/placeholder-logo.svg",
    bannerUrl: "/placeholder-banner.svg",
    whatsapp: "5511999999999",
    theme: "DEFAULT",
    products: mockProducts,
  },
  {
    id: "2",
    name: "Sabor & Arte",
    url: "sabor-arte",
    description: "Comidas artesanais feitas com carinho e ingredientes selecionados.",
    logoUrl: "/placeholder-logo.svg",
    bannerUrl: "/placeholder-banner.svg",
    whatsapp: "5511988888888",
    theme: "FOOD",
    products: [
      {
        id: "7",
        name: "Bolo de Chocolate Belga",
        description: "Bolo artesanal com chocolate belgo 70% cacau.",
        price: 89.9,
        imageUrl: "/placeholder-product.svg",
        category: "Bolos",
      },
      {
        id: "8",
        name: "Kit Especiarias Premium",
        description: "Kit com 12 especiarias selecionadas do mundo todo.",
        price: 149.9,
        imageUrl: "/placeholder-product.svg",
        category: "Kits",
      },
    ],
  },
  {
    id: "3",
    name: "Moda Elegante",
    url: "moda-elegante",
    description: "As últimas tendências da moda com estilo e sofisticação.",
    logoUrl: "/placeholder-logo.svg",
    bannerUrl: "/placeholder-banner.svg",
    whatsapp: "5511977777777",
    theme: "FASHION",
    products: [
      {
        id: "9",
        name: "Vestido Floral Verão",
        description: "Vestido leve em tecido premium com estampa floral exclusiva.",
        price: 199.9,
        imageUrl: "/placeholder-product.svg",
        category: "Vestidos",
      },
      {
        id: "10",
        name: "Bolsa Couro Legítimo",
        description: "Bolsa em couro legítimo com acabamento artesanal.",
        price: 399.9,
        imageUrl: "/placeholder-product.svg",
        category: "Acessórios",
      },
    ],
  },
];

export function getStoreByUrl(url: string): Store | undefined {
  return mockStores.find((store) => store.url === url);
}

export function getProductById(
  storeUrl: string,
  productId: string
): { store: Store; product: Product } | undefined {
  const store = getStoreByUrl(storeUrl);
  if (!store) return undefined;
  const product = store.products.find((p) => p.id === productId);
  if (!product) return undefined;
  return { store, product };
}
