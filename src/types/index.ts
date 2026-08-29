import type { ThemeSegment } from "@/lib/themes";

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl: string | null;
  images?: string[];
  category: string;
  categoryId?: string | null;
  brand?: string;
  stock?: number;
  featured?: boolean;
  originalPrice?: number;
}

export interface StoreBanner {
  image: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  textColor?: string;
  alignment?: "LEFT" | "CENTER" | "RIGHT";
}

export interface Store {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  banners?: StoreBanner[];
  whatsapp: string;
  theme: ThemeSegment;
  primaryColor?: string;
  secondaryColor?: string;
  products: Product[];
}
