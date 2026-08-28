import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoreHeader } from "@/components/store/StoreHeader";
import { BannerCarousel } from "@/components/store/BannerCarousel";
import { ProductFilters } from "@/components/store/ProductFilters";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreFooter } from "@/components/store/StoreFooter";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { getPublicStoreBySlug } from "@/lib/store-data";

interface StorePageProps {
  params: Promise<{ storeUrl: string }>;
  searchParams: Promise<{ category?: string; min?: string; max?: string; q?: string }>;
}

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { storeUrl } = await params;
  const { category, min, max, q } = await searchParams;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    notFound();
  }

  // Use real categories from DB, fallback to derived from products
  const categories =
    store.categories.length > 0
      ? store.categories.map((c) => c.name)
      : Array.from(new Set(store.products.map((p) => p.category)));

  // Filter products
  let filteredProducts = store.products;

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (min) {
    filteredProducts = filteredProducts.filter((p) => p.price >= Number(min));
  }

  if (max) {
    filteredProducts = filteredProducts.filter((p) => p.price <= Number(max));
  }

  if (q) {
    const query = q.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const hasActiveFilters = category || min || max || q;

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader
        name={store.name}
        storeUrl={store.slug}
        whatsapp={store.whatsapp}
        categories={
          store.categories.length > 0
            ? store.categories.map((c) => ({ name: c.name, slug: c.slug }))
            : categories
        }
      />

      <main className="flex-1">
        {/* Banner / Heroes */}
        <BannerCarousel
          banners={store.heroes.map((h) => ({
            image: h.image || "",
            title: h.title,
            description: h.description || undefined,
            buttonText: h.buttonText || undefined,
            buttonLink: h.buttonUrl || undefined,
            bgColor: h.bgColor || undefined,
            textColor: h.textColor || undefined,
            alignment: h.alignment,
          }))}
        />

        {/* Filters */}
        <Suspense>
          <ProductFilters categories={categories} storeUrl={store.slug} />
        </Suspense>

        {/* Products */}
        <section id="produtos" className="py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--theme-primary)" }}
                >
                  {q
                    ? `Resultado para "${q}"`
                    : hasActiveFilters
                      ? "Resultado da busca"
                      : "Catálogo completo"}
                </span>
                <h2
                  className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl"
                  style={{ color: "var(--theme-text)" }}
                >
                  {hasActiveFilters
                    ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}`
                    : "Todos os produtos"}
                </h2>
              </div>
              {hasActiveFilters && (
                <a
                  href={`/${storeUrl}`}
                  className="text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ color: "var(--theme-text)" }}
                >
                  Limpar filtros
                </a>
              )}
            </div>
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                storeUrl={store.slug}
                whatsapp={store.whatsapp}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
                style={{
                  borderColor: "var(--theme-border)",
                  backgroundColor: "var(--theme-card-bg)",
                }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--theme-text)" }}
                >
                  Nenhum produto encontrado
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--theme-text)", opacity: 0.5 }}
                >
                  Tente ajustar os filtros ou{" "}
                  <a
                    href={`/${storeUrl}`}
                    className="underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    ver todos os produtos
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <StoreFooter
        name={store.name}
        storeUrl={store.slug}
        description={store.description}
        whatsapp={store.whatsapp}
        email={store.email}
        phone={store.phone}
        address={store.address}
        city={store.city}
        state={store.state}
        postalCode={store.postalCode}
        websiteUrl={store.websiteUrl}
        instagramUrl={store.instagramUrl}
        facebookUrl={store.facebookUrl}
      />

      {store.whatsapp && (
        <FloatingWhatsApp
          whatsapp={store.whatsapp}
          storeName={store.name}
        />
      )}
    </div>
  );
}
