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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
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
