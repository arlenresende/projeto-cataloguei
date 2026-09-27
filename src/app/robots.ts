import type { MetadataRoute } from "next";
import { getPublicProductSitemapIds } from "@/lib/sitemap";
import { absoluteUrl, getSiteUrl } from "@/lib/site-config";

const privatePaths = [
  "/admin",
  "/login",
  "/register",
  "/verify-email",
  "/api",
];

const publicPaths = [
  "/",
  "/catalogo-online",
  "/catalogo-digital",
  "/catalogo-para-whatsapp",
  "/catalogo-digital-gratis",
  "/como-criar-catalogo-online",
  "/catalogo-para-loja-de-roupas",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/og",
  "/og/",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const productSitemapIds = await getPublicProductSitemapIds();

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicPaths,
        disallow: privatePaths,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot"],
        allow: publicPaths,
        disallow: privatePaths,
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      ...productSitemapIds.map((id) => absoluteUrl(`/products/sitemap/${id}.xml`)),
    ],
    host: getSiteUrl(),
  };
}
