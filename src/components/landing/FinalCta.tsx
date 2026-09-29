import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--brand-black)] py-20 md:py-28"
      aria-labelledby="final-cta-title"
    >
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--brand-black)] via-[var(--brand-black)] to-[var(--brand-black)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2
          id="final-cta-title"
          className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          Coloque sua vitrine no ar e pare de vender na bagunça
        </h2>
        <p className="mt-4 text-base text-white/60 md:text-lg">
          Crie seu catálogo, envie o link para seus clientes e receba pedidos
          mais claros pelo WhatsApp. O plano grátis já ajuda você a começar.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/admin/dashboard" />}>
            <span className="flex items-center">
              Criar meu catálogo grátis
              <ArrowRight className="ml-2 size-4" />
            </span>
          </Button>
          <Button
            size="lg"
            render={<Link href="/demo" />}
            className="border border-white/25 bg-transparent text-white hover:bg-white/10"
          >
            Ver demonstração
          </Button>
        </div>
      </div>
    </section>
  );
}
