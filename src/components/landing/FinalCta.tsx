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
          Comece a vender online hoje
        </h2>
        <p className="mt-4 text-base text-white/60 md:text-lg">
          Crie seu catálogo em minutos, compartilhe com seus clientes e receba
          pedidos pelo WhatsApp. Plano grátis para começar.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/admin/dashboard" />}>
            <span className="flex items-center">
              Criar catálogo grátis
              <ArrowRight className="ml-2 size-4" />
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/techstore" />}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Ver demonstração
          </Button>
        </div>
      </div>
    </section>
  );
}
