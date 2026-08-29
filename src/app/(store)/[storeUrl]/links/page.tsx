import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { StructuredData } from "@/components/seo/structured-data";
import { getPublicLinktreeByStoreSlug } from "@/lib/store-data";
import {
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildCollectionPageJsonLd,
  buildDefaultSeoImage,
  buildNoIndexMetadata,
  buildPageMetadata,
  truncateText,
} from "@/lib/seo";
import { absoluteUrl, toAbsoluteAssetUrl } from "@/lib/site-config";

const LINK_TYPES: Record<string, { label: string; color: string }> = {
  instagram: { label: "Instagram", color: "#c13584" },
  whatsapp: { label: "WhatsApp", color: "#25d366" },
  tiktok: { label: "TikTok", color: "#010101" },
  youtube: { label: "YouTube", color: "#ff0000" },
  twitter: { label: "Twitter/X", color: "#1da1f2" },
  facebook: { label: "Facebook", color: "#1877f2" },
  website: { label: "Website", color: "#6366f1" },
  email: { label: "Email", color: "#ea580c" },
  phone: { label: "Telefone", color: "#0d9488" },
  spotify: { label: "Spotify", color: "#1db954" },
  linkedin: { label: "LinkedIn", color: "#0a66c2" },
  pinterest: { label: "Pinterest", color: "#e60023" },
  github: { label: "GitHub", color: "#333333" },
};

function getLinkType(type: string | null) {
  if (!type) return { label: "Link", color: "#6b7280" };
  return LINK_TYPES[type] || { label: "Link", color: "#6b7280" };
}

interface LinksPageProps {
  params: Promise<{ storeUrl: string }>;
}

export async function generateMetadata({
  params,
}: LinksPageProps): Promise<Metadata> {
  const { storeUrl } = await params;
  const result = await getPublicLinktreeByStoreSlug(storeUrl);

  if (!result) {
    return buildNoIndexMetadata("Links não encontrados");
  }

  const { store, linktree } = result;
  const canonicalPath = `/${storeUrl}/links`;
  const title = `${linktree.title} | Links`;
  const description = truncateText(
    linktree.description || `Links oficiais de ${linktree.title}.`
  );
  const shareImages = [
    ...(toAbsoluteAssetUrl(store.logo)
      ? [
          {
            url: toAbsoluteAssetUrl(store.logo)!,
            alt: `Logo de ${store.name}`,
          },
        ]
      : []),
    {
      url: absoluteUrl(`/og/store/${storeUrl}`),
      alt: `Compartilhamento da página de links de ${linktree.title}`,
    },
    buildDefaultSeoImage(),
  ];

  return buildPageMetadata({
    title,
    socialTitle: `${linktree.title} | Links | Cataloguei`,
    description,
    path: canonicalPath,
    openGraphType: "profile",
    images: shareImages,
  });
}

export default async function LinksPage({ params }: LinksPageProps) {
  const { storeUrl } = await params;
  const result = await getPublicLinktreeByStoreSlug(storeUrl);

  if (!result) {
    notFound();
  }

  const { store, linktree } = result;
  const bg = linktree.backgroundColor || "#1a1a2e";
  const textColor = linktree.textColor || "#e2e8f0";
  const canonicalUrl = buildCanonicalUrl(`/${storeUrl}/links`);
  const logoUrl = toAbsoluteAssetUrl(store.logo);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ backgroundColor: bg, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <StructuredData
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: store.name, url: absoluteUrl(`/${storeUrl}`) },
          { name: "Links", url: canonicalUrl },
        ])}
      />
      <StructuredData
        data={buildCollectionPageJsonLd({
          name: `${linktree.title} | Links`,
          description: linktree.description,
          url: canonicalUrl,
        })}
      />

      <section className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div
            className="mb-5 flex size-24 items-center justify-center overflow-hidden rounded-full text-4xl font-extrabold"
            style={{
              backgroundColor: textColor + "12",
              color: textColor,
              border: `2px solid ${textColor}20`,
            }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Logo de ${store.name}`}
                width={96}
                height={96}
                className="size-full object-cover"
                priority
              />
            ) : (
              linktree.title.charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="text-2xl font-extrabold" style={{ color: textColor }}>
            {linktree.title}
          </h1>

          {linktree.description ? (
            <p
              className="mt-2 max-w-sm text-sm leading-relaxed"
              style={{ color: textColor, opacity: 0.55 }}
            >
              {linktree.description}
            </p>
          ) : null}

          <div className="mt-8 flex w-full flex-col gap-3">
            {linktree.links.map((link) => {
              const typeInfo = getLinkType(link.linkType);

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    backgroundColor: typeInfo.color + "15",
                    color: textColor,
                    border: `1px solid ${typeInfo.color}25`,
                  }}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: typeInfo.color + "bb" }}
                  >
                    {typeInfo.label.charAt(0)}
                  </span>
                  <span className="flex-1 truncate text-left">{link.title}</span>
                  <ExternalLink
                    size={16}
                    className="shrink-0 opacity-25 transition-opacity group-hover:opacity-50"
                  />
                </a>
              );
            })}
          </div>

          <p
            className="mt-12 text-xs font-medium"
            style={{ color: textColor, opacity: 0.2 }}
          >
            {store.name} no Cataloguei
          </p>
        </div>
      </section>
    </main>
  );
}
