import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 md:pt-24 md:pb-28 lg:pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-3.5 py-1 text-xs font-medium text-[var(--brand-black)]">
            <Sparkles className="size-3.5" />
            Novo · Catálogos com IA e integração WhatsApp
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-[var(--brand-black)] md:text-5xl lg:text-[3.5rem]">
            Seu catálogo online
            <br className="hidden sm:block" />{" "}
            <span className="text-[var(--brand-yellow)]">pronto em minutos</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Crie um catálogo profissional para sua pequena empresa, escolha um
            tema que combina com seu segmento e receba pedidos diretamente no
            WhatsApp. Sem complicação.
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
            >
              Ver demonstração
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sem cartão de crédito · Setup em menos de 5 minutos
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
