import type { Metadata } from "next";
import { AcquisitionPage } from "@/components/marketing/acquisition-page";
import { getAcquisitionPage } from "@/lib/acquisition-pages";
import { buildPageMetadata } from "@/lib/seo";

const page = getAcquisitionPage("catalogo-para-loja-de-roupas");

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: `/${page.slug}`,
  keywords: page.keywords,
});

export default function CatalogoParaLojaDeRoupasPage() {
  return <AcquisitionPage page={page} />;
}
