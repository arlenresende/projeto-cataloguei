import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreFooter } from "@/components/store/StoreFooter";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { getPublicStoreBySlug } from "@/lib/store-data";
import { prisma } from "@/lib/prisma";

interface CategoryPageProps {
  params: Promise<{ storeUrl: string; slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { storeUrl, slug } = await params;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    notFound();
  }

  const category = await prisma.category.findFirst({
    where: {
      slug,
      storeId: store.id,
      isActive: true,
    },
  });

  if (!category) {
    notFound();
  }

  // Filter products by category name (since products use the string category field)
  const categoryProducts = store.products.filter(
    (p) => p.category === category.name
  );

  return (
    <div className="flex min-h-screen flex-col">
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
            {/* Back link */}
            <Link
              href={`/${storeUrl}`}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: "var(--theme-text)" }}
            >
              <ChevronLeft size={16} />
              Voltar para a loja
            </Link>

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
                  <a
                    href={`/${storeUrl}`}
                    className="underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    Ver todos os produtos
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
