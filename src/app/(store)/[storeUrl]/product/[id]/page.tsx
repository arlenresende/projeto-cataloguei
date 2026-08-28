import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Share2, Shield, Truck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPublicStoreBySlug } from "@/lib/store-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { ProductGallery } from "@/components/store/ProductGallery";

interface ProductPageProps {
  params: Promise<{ storeUrl: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { storeUrl, id } = await params;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    notFound();
  }

  const product = store.products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    notFound();
  }

  const categories =
    store.categories.length > 0
      ? store.categories.map((c) => ({ name: c.name, slug: c.slug }))
      : Array.from(new Set(store.products.map((p) => p.category)));

  const relatedProducts = store.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const images = product.images?.length ? product.images : [product.imageUrl];

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader
        name={store.name}
        storeUrl={store.slug}
        whatsapp={store.whatsapp}
        categories={categories}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link
            href={`/${storeUrl}`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-text)", opacity: 0.6 }}
          >
            <ArrowLeft className="size-4" />
            Voltar para {store.name}
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            <ProductGallery images={images} productName={product.name} />

            <div className="flex flex-col">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--theme-text)", opacity: 0.4 }}
              >
                {product.category}
              </span>
              <h1
                className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl"
                style={{ color: "var(--theme-text)" }}
              >
                {product.name}
              </h1>

              {product.description ? (
                <div
                  className="prose prose-sm mt-5 max-w-none text-base leading-relaxed"
                  style={{ color: "var(--theme-text)", opacity: 0.7 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : null}

              <div className="mt-8 flex items-baseline gap-3">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span
                    className="text-lg font-medium line-through"
                    style={{ color: "var(--theme-text)", opacity: 0.35 }}
                  >
                    {product.compareAtPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                )}
                <span
                  className="text-4xl font-extrabold"
                  style={{ color: "var(--theme-text)" }}
                >
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              {product.brand && (
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--theme-text)", opacity: 0.5 }}
                >
                  Marca: {product.brand}
                </p>
              )}

              {product.stock !== undefined && product.stock === 0 && (
                <p className="mt-2 text-sm font-bold text-red-500">
                  Produto indisponível
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3">
                {store.whatsapp && (
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageCircle size={20} />
                    Comprar pelo WhatsApp
                  </a>
                )}
                <button
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    color: "var(--theme-secondary)",
                  }}
                >
                  <Share2 size={16} />
                  Compartilhar produto
                </button>
              </div>

              <div
                className="mt-8 grid gap-3 rounded-2xl border p-5"
                style={{ borderColor: "var(--theme-border)" }}
              >
                {[
                  { icon: Truck, text: "Entrega para todo o Brasil" },
                  { icon: Shield, text: "Compra segura garantida" },
                  { icon: Star, text: "Qualidade assegurada" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: "var(--theme-text)", opacity: 0.6 }}
                  >
                    <Icon size={16} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "var(--theme-text)" }}
              >
                Você também pode gostar
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    storeUrl={store.slug}
                    whatsapp={store.whatsapp}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
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
