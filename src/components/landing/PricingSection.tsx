import { Check, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const FREE_FEATURES = [
  "1 loja com URL propria do Cataloguei",
  "Ate 15 produtos",
  "Analytics basico",
  "Ate 2 banners ativos",
  "Personalizacao basica",
  "SEO basico",
  "Marca Cataloguei obrigatoria",
];

const PREMIUM_FEATURES = [
  "Tudo do plano Free",
  "Produtos ilimitados",
  "Banners ilimitados",
  "Remocao da marca Cataloguei",
  "Analytics completo",
  "Personalizacao completa",
  "SEO avancado e dominio proprio",
  "Compartilhamento avancado e suporte prioritario",
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-white py-20 md:py-28"
      aria-labelledby="pricing-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--brand-black)]">
            PLANOS
          </p>
          <h2
            id="pricing-title"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--brand-black)] md:text-4xl lg:text-5xl"
          >
            Comece do seu jeito
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Crie sua página gratuitamente e evolua quando seu negócio precisar
            de mais.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-[var(--brand-border)] bg-white p-8">
            <div>
              <h3 className="text-lg font-semibold text-[var(--brand-black)]">Grátis</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Para comecar sua loja online com o essencial.
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-[var(--brand-black)]">
                  R$ 0
                </span>
                <span className="text-sm text-muted-foreground">para sempre</span>
              </div>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--brand-black)]" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button variant="outline" className="w-full" size="lg">
                Começar grátis
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-[var(--brand-black)] bg-white p-8 shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-block rounded-full bg-[var(--brand-yellow)] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-black)]">
                Mais popular
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--brand-black)]">Premium</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Para quem quer crescer com recursos avancados e assinatura mensal.
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-[var(--brand-black)]">
                  R$ 24,90
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--brand-black)]" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button className="w-full" size="lg">
                Quero ser Premium
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Special block */}
        <div className="mt-12 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-tertiary)] p-8 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-yellow-light)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-black)]">
              <Lightbulb className="size-3.5" />
              Exclusivo Premium
            </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--brand-black)] md:text-3xl">
              Sentiu falta de alguma coisa? Pensamos junto com você.
            </h3>
            <p className="mt-3 text-base text-muted-foreground">
              Tem uma necessidade que ainda não existe no projeto? Conte para a
              gente o que você precisa e vamos avaliar juntos a melhor forma de
              transformar essa ideia em uma nova possibilidade para o seu
              negócio.
            </p>
            <div className="mt-6">
              <Button variant="outline" size="lg">
                Quero sugerir uma ideia
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
