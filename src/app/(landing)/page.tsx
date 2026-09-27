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
  SeoContent,
  HOME_FAQS,
  FinalCta,
  ContactSection,
  Footer,
} from "@/components/landing";
import { absoluteUrl, SITE_NAME } from "@/lib/site-config";
import {
  buildDefaultSeoImage,
  buildFaqPageJsonLd,
  buildJsonLdGraph,
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";

const HOME_TITLE = "Catálogo Digital para WhatsApp | Cataloguei";
const HOME_DESCRIPTION =
  "Crie seu catálogo online grátis em minutos. Personalize sua loja, organize seus produtos e receba pedidos diretamente pelo WhatsApp.";

export const metadata: Metadata = buildPageMetadata({
  title: HOME_TITLE,
  socialTitle: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  images: [buildDefaultSeoImage()],
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={buildJsonLdGraph([
          buildWebSiteJsonLd({
            name: SITE_NAME,
            url: absoluteUrl("/"),
            description: HOME_DESCRIPTION,
          }),
          buildOrganizationJsonLd(),
          buildSoftwareApplicationJsonLd(),
          buildFaqPageJsonLd(HOME_FAQS),
        ])}
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
        <SeoContent />
        <FinalCta />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
