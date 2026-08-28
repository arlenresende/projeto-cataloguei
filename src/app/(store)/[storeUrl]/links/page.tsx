import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

export default async function LinksPage({ params }: LinksPageProps) {
  const { storeUrl } = await params;

  const store = await prisma.store.findUnique({
    where: { slug: storeUrl, isActive: true },
    select: { id: true, name: true, logo: true },
  });

  if (!store) notFound();

  const linktree = await prisma.linktree.findUnique({
    where: { userId: store.id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  // Try by store's userId
  const storeWithUser = await prisma.store.findUnique({
    where: { slug: storeUrl, isActive: true },
    select: { userId: true },
  });

  let lt = linktree;
  if (!lt && storeWithUser) {
    lt = await prisma.linktree.findUnique({
      where: { userId: storeWithUser.userId },
      include: { links: { orderBy: { order: "asc" } } },
    });
  }

  if (!lt) notFound();

  const bg = lt.backgroundColor || "#1a1a2e";
  const textColor = lt.textColor || "#e2e8f0";

  return (
    <html>
      <head>
        <title>{lt.title} - Links</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={lt.description || `Links de ${lt.title}`} />
      </head>
      <body>
        <div
          className="flex min-h-screen items-center justify-center px-4 py-12"
          style={{ backgroundColor: bg, fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div
                className="mb-5 flex size-24 items-center justify-center rounded-full text-4xl font-extrabold"
                style={{
                  backgroundColor: textColor + "12",
                  color: textColor,
                  border: `2px solid ${textColor}20`,
                }}
              >
                {lt.title.charAt(0).toUpperCase()}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold" style={{ color: textColor }}>
                {lt.title}
              </h1>

              {/* Description */}
              {lt.description && (
                <p
                  className="mt-2 max-w-sm text-sm leading-relaxed"
                  style={{ color: textColor, opacity: 0.55 }}
                >
                  {lt.description}
                </p>
              )}

              {/* Links */}
              <div className="mt-8 flex w-full flex-col gap-3">
                {lt.links.map((link) => {
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

              {/* Footer */}
              <p
                className="mt-12 text-xs font-medium"
                style={{ color: textColor, opacity: 0.2 }}
              >
                Cataloguei
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
