import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Share2, Shield, Truck } from "lucide-react";
import { getProductById } from "@/lib/mock-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";

interface ProductPageProps {
  params: Promise<{ storeUrl: string; id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { storeUrl, id } = await params;
  const result = getProductById(storeUrl, id);

  if (!result) {
    notFound();
  }

  const { store, product } = result;

  const categories = Array.from(
    new Set(store.products.map((p) => p.category))
  );

  const relatedProducts = store.products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const whatsappLink = (() => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto: ${product.name}`
    );
    return `https://wa.me/${store.whatsapp}?text=${message}`;
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader
        name={store.name}
        storeUrl={store.url}
        categories={categories}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Breadcrumb */}
          <Link
            href={`/${storeUrl}`}
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-text)", opacity: 0.6 }}
          >
            <ArrowLeft className="size-4" />
            Voltar para {store.name}
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Image */}
            <div
              className="relative aspect-square overflow-hidden rounded-2xl"
              style={{ border: "1px solid var(--theme-border)" }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--theme-text)", opacity: 0.5 }}
              >
                {product.category}
              </span>
              <h1
                className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
                style={{ color: "var(--theme-text)" }}
              >
                {product.name}
              </h1>

              <p
                className="mt-4 text-base leading-relaxed"
                style={{ color: "var(--theme-text)", opacity: 0.7 }}
              >
                {product.description}
              </p>

              <div className="mt-6">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--theme-text)" }}
                >
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--theme-primary)",
                    color: "var(--theme-secondary)",
                  }}
                >
                  <MessageCircle size={20} />
                  Comprar pelo WhatsApp
                </a>
                <button
                  className="flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
                  style={{
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)",
                  }}
                >
                  <Share2 size={16} />
                  Compartilhar produto
                </button>
              </div>

              {/* Trust badges */}
              <div
                className="mt-8 grid grid-cols-1 gap-3 rounded-xl border p-4"
                style={{ borderColor: "var(--theme-border)" }}
              >
                {[
                  { icon: MessageCircle, text: "Atendimento via WhatsApp" },
                  { icon: Truck, text: "Entrega para todo o Brasil" },
                  { icon: Shield, text: "Compra segura" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "var(--theme-text)", opacity: 0.7 }}
                  >
                    <Icon size={16} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--theme-text)" }}
              >
                Você também pode gostar
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    storeUrl={store.url}
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
        storeUrl={store.url}
        description={store.description}
        whatsapp={store.whatsapp}
      />
    </div>
  );
}
