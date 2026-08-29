import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Shield, Star, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductShareButton } from "@/components/store/product-share-button";
import { getPublicProductByIdentifier } from "@/lib/store-data";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildOpenGraphImage,
  buildProductDescription,
  buildProductJsonLd,
  buildRobots,
  buildTwitterImage,
  getRealProductImages,
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-config";

interface ProductPageProps {
  params: Promise<{ storeUrl: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { storeUrl, id } = await params;
  const result = await getPublicProductByIdentifier(storeUrl, id);

  if (!result) {
    return {
      title: "Produto não encontrado",
      robots: buildRobots({ index: false }),
    };
  }

  const { store, product } = result;
  const canonicalPath = `/${store.slug}/product/${product.slug || product.id}`;
  const title = product.seoTitle || `${product.name} | ${store.name}`;
  const description = buildProductDescription({
    name: product.name,
    description: product.seoDescription || product.description,
    brand: product.brand,
    category: product.category,
    storeName: store.name,
  });
  const shareImageUrl = absoluteUrl(
    `/og/product/${store.slug}/${product.slug || product.id}`
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: buildRobots({ index: true }),
    openGraph: {
      url: buildCanonicalUrl(canonicalPath),
      title: product.seoTitle || `${product.name} | ${store.name} | Cataloguei`,
      description,
      siteName: "Cataloguei",
      locale: "pt_BR",
      images: [
        buildOpenGraphImage(
          shareImageUrl,
          `Compartilhamento do produto ${product.name}`
        ),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || `${product.name} | ${store.name} | Cataloguei`,
      description,
      images: [
        buildTwitterImage(
          shareImageUrl,
          `Compartilhamento do produto ${product.name}`
        ),
      ],
    },
    other: {
      "og:type": "product",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { storeUrl, id } = await params;
  const result = await getPublicProductByIdentifier(storeUrl, id);

  if (!result) {
    notFound();
  }

  const { store, product } = result;

  if (product.slug && id !== product.slug) {
    permanentRedirect(`/${store.slug}/product/${product.slug}`);
  }

  const categories =
    store.categories.length > 0
      ? store.categories.map((c) => ({ name: c.name, slug: c.slug }))
      : Array.from(new Set(store.products.map((p) => p.category)));

  const relatedProducts = store.products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const realProductImages = getRealProductImages(product.images || [], product.imageUrl);
  const galleryImages = realProductImages.length
    ? realProductImages
    : ["/placeholder-product.svg"];
  const canonicalUrl = buildCanonicalUrl(
    `/${store.slug}/product/${product.slug || product.id}`
  );
  const shareDescription = buildProductDescription({
    name: product.name,
    description: product.seoDescription || product.description,
    brand: product.brand,
    category: product.category,
    storeName: store.name,
  });
  const breadcrumbItems = [
    { name: "Home", url: absoluteUrl("/") },
    { name: store.name, url: absoluteUrl(`/${store.slug}`) },
    ...(product.categorySlug
      ? [
          {
            name: product.category,
            url: absoluteUrl(`/${store.slug}/categoria/${product.categorySlug}`),
          },
        ]
      : []),
    { name: product.name, url: canonicalUrl },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <StructuredData
        data={buildProductJsonLd({
          name: product.name,
          description: product.seoDescription || product.description,
          url: canonicalUrl,
          images: realProductImages,
          sku: product.sku,
          brand: product.brand,
          category: product.category,
          price: product.price,
          availability:
            typeof product.stock === "number"
              ? product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
              : undefined,
        })}
      />

      <StoreHeader
        name={store.name}
        storeUrl={store.slug}
        logoUrl={store.logo}
        whatsapp={store.whatsapp}
        categories={categories}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: store.name, href: `/${store.slug}` },
              ...(product.categorySlug
                ? [
                    {
                      label: product.category,
                      href: `/${store.slug}/categoria/${product.categorySlug}`,
                    },
                  ]
                : []),
              { label: product.name },
            ]}
          />

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
            <ProductGallery images={galleryImages} productName={product.name} />

            <article className="flex flex-col">
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
                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <span
                    className="text-lg font-medium line-through"
                    style={{ color: "var(--theme-text)", opacity: 0.35 }}
                  >
                    {product.compareAtPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                ) : null}
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

              {product.brand ? (
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--theme-text)", opacity: 0.5 }}
                >
                  Marca: {product.brand}
                </p>
              ) : null}

              {product.stock !== undefined && product.stock === 0 ? (
                <p className="mt-2 text-sm font-bold text-red-500">
                  Produto indisponível
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3">
                {store.whatsapp ? (
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
                ) : null}

                <ProductShareButton
                  title={product.name}
                  description={shareDescription}
                  url={canonicalUrl}
                />
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
            </article>
          </div>

          {relatedProducts.length > 0 ? (
            <section className="mt-16" aria-labelledby="related-products-heading">
              <h2
                id="related-products-heading"
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "var(--theme-text)" }}
              >
                Você também pode gostar
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    storeUrl={store.slug}
                    whatsapp={store.whatsapp}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
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

      {store.whatsapp ? (
        <FloatingWhatsApp whatsapp={store.whatsapp} storeName={store.name} />
      ) : null}
    </div>
  );
}
