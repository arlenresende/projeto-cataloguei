import type { ThemeSegment } from "@/lib/themes";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];
  category: string;
  originalPrice?: number;
}

export interface StoreBanner {
  image: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
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
