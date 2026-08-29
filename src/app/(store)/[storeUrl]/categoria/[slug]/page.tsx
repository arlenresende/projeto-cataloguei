import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreFooter } from "@/components/store/StoreFooter";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { getPublicCategoryBySlug } from "@/lib/store-data";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildCategoryDescription,
  buildOpenGraphImage,
  buildRobots,
  buildTwitterImage,
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

interface CategoryPageProps {
  params: Promise<{ storeUrl: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { storeUrl, slug } = await params;
  const result = await getPublicCategoryBySlug(storeUrl, slug);

  if (!result) {
    return {
      title: "Categoria não encontrada",
      robots: buildRobots({ index: false }),
    };
  }

  const { store, category } = result;
  const title = `${category.name} | ${store.name}`;
  const description = buildCategoryDescription({
    categoryName: category.name,
    description: category.description,
    storeName: store.name,
  });
  const canonicalPath = `/${store.slug}/categoria/${category.slug}`;
  const shareImageUrl = absoluteUrl(`/og/store/${store.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: buildRobots({ index: true }),
    openGraph: {
      type: "website",
      url: buildCanonicalUrl(canonicalPath),
      title,
      description,
      siteName: "Cataloguei",
      locale: "pt_BR",
      images: [buildOpenGraphImage(shareImageUrl, `Categoria ${category.name} da loja ${store.name}`)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [buildTwitterImage(shareImageUrl, `Categoria ${category.name} da loja ${store.name}`)],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { storeUrl, slug } = await params;
  const result = await getPublicCategoryBySlug(storeUrl, slug);

  if (!result) {
    notFound();
  }

  const { store, category, products: categoryProducts } = result;

  const canonicalUrl = buildCanonicalUrl(`/${store.slug}/categoria/${category.slug}`);
  const breadcrumbItems = [
    { name: "Home", url: absoluteUrl("/") },
    { name: store.name, url: absoluteUrl(`/${store.slug}`) },
    { name: category.name, url: canonicalUrl },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <StoreHeader
        name={store.name}
        storeUrl={store.slug}
        logoUrl={store.logo}
        whatsapp={store.whatsapp}
        categories={
          store.categories.length > 0
            ? store.categories.map((c) => ({ name: c.name, slug: c.slug }))
            : []
        }
      />

      <main className="flex-1">
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: store.name, href: `/${store.slug}` },
                { label: category.name },
              ]}
            />

            {/* Category header */}
            <div className="mb-8">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--theme-primary)" }}
              >
                Categoria
              </span>
              <h1
                className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl"
                style={{ color: "var(--theme-text)" }}
              >
                {category.name}
              </h1>
              {category.description && (
                <p
                  className="mt-2 max-w-lg text-sm font-medium"
                  style={{ color: "var(--theme-text)", opacity: 0.6 }}
                >
                  {category.description}
                </p>
              )}
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: "var(--theme-text)", opacity: 0.5 }}
              >
                {categoryProducts.length}{" "}
                {categoryProducts.length === 1 ? "produto" : "produtos"}
              </p>
            </div>

            {/* Products */}
            {categoryProducts.length > 0 ? (
              <ProductGrid
                products={categoryProducts}
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
                  Nenhum produto nesta categoria
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--theme-text)", opacity: 0.5 }}
                >
                  <Link
                    href={`/${storeUrl}`}
                    className="underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    Ver todos os produtos
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
        showCatalogueiBranding={!store.hideCatalogueiBranding}
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
