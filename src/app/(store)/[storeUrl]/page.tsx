import { notFound } from "next/navigation";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreHero } from "@/components/store/StoreHero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreFooter } from "@/components/store/StoreFooter";
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

  const categories = Array.from(
    new Set(store.products.map((p) => p.category))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader
        name={store.name}
        storeUrl={store.url}
        categories={categories}
      />

      <main className="flex-1">
        <StoreHero
          name={store.name}
          description={store.description}
          bannerUrl={store.bannerUrl}
          logoUrl={store.logoUrl}
        />

        <section id="produtos" className="py-10 md:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2
              className="text-xl font-bold md:text-2xl"
              style={{ color: "var(--theme-text)" }}
            >
              Produtos
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--theme-text)", opacity: 0.6 }}
            >
              {store.products.length} produtos disponíveis
            </p>
            <div className="mt-6">
              <ProductGrid
                products={store.products}
                storeUrl={store.url}
                whatsapp={store.whatsapp}
              />
            </div>
          </div>
        </section>
      </main>

      <StoreFooter
        name={store.name}
        storeUrl={store.url}
        description={store.description}
        whatsapp={store.whatsapp}
      />
    </div>
  );
}
