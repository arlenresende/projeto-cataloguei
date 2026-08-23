import type { ThemeSegment } from "@/lib/themes";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  whatsapp: string;
  theme: ThemeSegment;
  primaryColor?: string;
  secondaryColor?: string;
  products: Product[];
}
