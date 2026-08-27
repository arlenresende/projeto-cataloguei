import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  storeUrl: string;
  whatsapp?: string;
}

export function ProductGrid({ products, storeUrl, whatsapp }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          storeUrl={storeUrl}
          whatsapp={whatsapp}
        />
      ))}
    </div>
  );
}
