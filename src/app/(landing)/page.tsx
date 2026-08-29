import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import {
  Header,
  Hero,
  LogoCloud,
  FeatureGrid,
  ProductShowcase,
  FeatureTabs,
  IntegrationsList,
  PricingSection,
  FinalCta,
  ContactSection,
  Footer,
} from "@/components/landing";
import { absoluteUrl, SITE_NAME } from "@/lib/site-config";
import {
  buildDefaultSeoImage,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from "@/lib/seo";

const HOME_TITLE = "Catálogo online para vender mais pelo WhatsApp";
const HOME_DESCRIPTION =
  "Crie sua vitrine digital com catálogo de produtos, páginas de loja, SEO técnico e compartilhamento rápido para vender mais com o Cataloguei.";

export const metadata: Metadata = buildPageMetadata({
  title: HOME_TITLE,
  socialTitle: `${SITE_NAME} | Catálogo online para vender mais`,
  description: HOME_DESCRIPTION,
  path: "/",
  images: [buildDefaultSeoImage()],
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={buildWebSiteJsonLd({
          name: SITE_NAME,
          url: absoluteUrl("/"),
          description: HOME_DESCRIPTION,
        })}
      />
      <Header />
      <main id="main">
        <Hero />
        <LogoCloud />
        <FeatureGrid />
        <ProductShowcase />
        <FeatureTabs />
        <IntegrationsList />
        <PricingSection />
        <FinalCta />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
