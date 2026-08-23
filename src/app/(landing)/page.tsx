import {
  Header,
  Hero,
  LogoCloud,
  FeatureGrid,
  ProductShowcase,
  FeatureTabs,
  IntegrationsList,
  FinalCta,
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
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
