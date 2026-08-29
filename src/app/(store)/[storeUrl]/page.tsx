import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { BannerCarousel } from "@/components/store/BannerCarousel";
import { ProductFilters } from "@/components/store/ProductFilters";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreFooter } from "@/components/store/StoreFooter";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { getPublicStoreBySlug } from "@/lib/store-data";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildOpenGraphImage,
  buildRobots,
  buildStoreDescription,
  buildStoreJsonLd,
  buildTwitterImage,
} from "@/lib/seo";
import { absoluteUrl, toAbsoluteAssetUrl } from "@/lib/site-config";

interface StorePageProps {
  params: Promise<{ storeUrl: string }>;
  searchParams: Promise<{ category?: string; min?: string; max?: string; q?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: StorePageProps): Promise<Metadata> {
  const { storeUrl } = await params;
  const filters = await searchParams;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    return {
      title: "Loja não encontrada",
      robots: buildRobots({ index: false }),
    };
  }

  const hasActiveFilters = Boolean(
    filters.category || filters.min || filters.max || filters.q
  );
  const title = store.name;
  const description = buildStoreDescription({
    name: store.name,
    description: store.description,
    city: store.city,
    state: store.state,
  });
  const canonicalPath = `/${store.slug}`;
  const shareImageUrl = absoluteUrl(`/og/store/${store.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: buildRobots({ index: !hasActiveFilters }),
    openGraph: {
      type: "website",
      url: buildCanonicalUrl(canonicalPath),
      title: `${store.name} | Cataloguei`,
      description,
      siteName: "Cataloguei",
      locale: "pt_BR",
      images: [buildOpenGraphImage(shareImageUrl, `Compartilhamento da loja ${store.name}`)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${store.name} | Cataloguei`,
      description,
      images: [buildTwitterImage(shareImageUrl, `Compartilhamento da loja ${store.name}`)],
    },
  };
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
  const canonicalUrl = buildCanonicalUrl(`/${store.slug}`);
  const breadcrumbItems = [
    { name: "Home", url: absoluteUrl("/") },
    { name: store.name, url: canonicalUrl },
  ];
  const shareImage = toAbsoluteAssetUrl(store.heroes[0]?.image || store.logo);

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData
        data={buildBreadcrumbJsonLd(breadcrumbItems)}
      />
      <StructuredData
        data={buildStoreJsonLd({
          name: store.name,
          description: store.description,
          url: canonicalUrl,
          image: shareImage,
          email: store.email,
          phone: store.phone,
          address: store.address,
          city: store.city,
          state: store.state,
          postalCode: store.postalCode,
          country: store.country,
        })}
      />
      <StoreHeader
        name={store.name}
        storeUrl={store.slug}
        logoUrl={store.logo}
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
                <Link
                  href={`/${storeUrl}`}
                  className="text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ color: "var(--theme-text)" }}
                >
                  Limpar filtros
                </Link>
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
                  <Link
                    href={`/${storeUrl}`}
                    className="underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    ver todos os produtos
                  </Link>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <StoreFooter
        name={store.name}
        storeUrl={store.slug}
        logoUrl={store.logo}
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
