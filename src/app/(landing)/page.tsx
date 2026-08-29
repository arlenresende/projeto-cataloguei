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
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Catálogo online para vender mais pelo WhatsApp",
  description:
    "Crie sua vitrine digital com catálogo de produtos, páginas de loja, SEO técnico e compartilhamento rápido para vender mais com o Cataloguei.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Cataloguei | Catálogo online para vender mais",
    description:
      "Crie sua vitrine digital com catálogo de produtos, páginas de loja, SEO técnico e compartilhamento rápido para vender mais com o Cataloguei.",
    siteName: "Cataloguei",
    locale: "pt_BR",
    images: [
      {
        url: absoluteUrl("/og"),
        width: 1200,
        height: 630,
        alt: "Compartilhamento do Cataloguei",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cataloguei | Catálogo online para vender mais",
    description:
      "Crie sua vitrine digital com catálogo de produtos, páginas de loja, SEO técnico e compartilhamento rápido para vender mais com o Cataloguei.",
    images: [
      {
        url: absoluteUrl("/og"),
        alt: "Compartilhamento do Cataloguei",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Cataloguei",
          url: absoluteUrl("/"),
          description:
            "Crie sua vitrine digital com catálogo de produtos, páginas de loja e compartilhamento para vender mais.",
          inLanguage: "pt-BR",
        }}
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
