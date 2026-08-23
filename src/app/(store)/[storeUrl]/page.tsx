import { notFound } from "next/navigation";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductGrid } from "@/components/store/ProductGrid";
import { getStoreByUrl } from "@/lib/mock-data";

interface StorePageProps {
  params: Promise<{ storeUrl: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeUrl } = await params;
  const store = getStoreByUrl(storeUrl);

  if (!store) {
    notFound();
  }

  return (
    <div>
      <StoreHeader
        name={store.name}
        description={store.description}
        logoUrl={store.logoUrl}
        bannerUrl={store.bannerUrl}
      />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Produtos</h2>
        <ProductGrid products={store.products} whatsapp={store.whatsapp} />
      </main>
    </div>
  );
}
