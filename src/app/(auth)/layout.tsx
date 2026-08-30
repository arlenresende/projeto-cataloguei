import type { Metadata } from "next";
import { MoreVertical } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: {
    default: "Acesse sua conta",
    template: "%s | Conta | Cataloguei",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function BrandHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-8 py-7 sm:px-10 lg:px-12">
      <BrandLogo variant="header" />
    </header>
  );
}

function DecorativePreview() {
  return (
    <section
      className="relative hidden min-h-[620px] flex-1 overflow-hidden bg-pattern lg:block"
      aria-hidden="true"
    >
      <div className="absolute left-[18%] top-[36%] w-[58%] max-w-[270px] rounded-xl bg-[#292d31] p-7 text-background shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <span className="size-4 rounded-full bg-accent" />
            <span className="size-4 rounded-full border border-background bg-card" />
          </div>
          <MoreVertical size={17} />
        </div>
        <p className="mt-5 text-2xl font-light">R$ 4.280,00</p>
        <p className="mt-2 text-xs">Faturamento</p>
        <div className="mt-10 flex justify-between text-[10px] tracking-[0.25em] text-accent">
          <span>** **</span>
          <span>****</span>
          <span>7821</span>
        </div>
      </div>

      <div className="absolute right-[7%] top-[23%] w-[68%] max-w-[250px] rounded-xl bg-card px-7 py-5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs">09:00 - 18:00</p>
            <p className="mt-1 text-base font-medium">Novos Pedidos</p>
          </div>
          <MoreVertical size={16} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            <span className="size-8 rounded-full bg-[#d4b49c] ring-2 ring-card" />
            <span className="size-8 rounded-full bg-[#8f806c] ring-2 ring-card" />
            <span className="size-8 rounded-full bg-[#65734b] ring-2 ring-card" />
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold">
            +12
          </span>
        </div>
      </div>

      <div className="absolute left-[9%] top-[55%] w-[42%] max-w-[158px] rounded-xl bg-card p-5 shadow-lg">
        <div className="flex h-10 items-end justify-between gap-2">
          <i className="h-4 w-3 rounded bg-foreground/80" />
          <i className="h-2 w-3 rounded bg-muted-foreground" />
          <i className="h-7 w-3 rounded bg-accent" />
          <i className="h-10 w-3 rounded bg-accent" />
          <i className="h-3 w-3 rounded bg-muted-foreground" />
          <i className="h-8 w-3 rounded bg-accent" />
          <i className="h-4 w-3 rounded bg-foreground/80" />
        </div>
        <div className="mt-2 flex justify-between text-[8px] text-muted-foreground">
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sab</span>
          <span>Dom</span>
        </div>
      </div>

      <div className="absolute bottom-0 right-[7%] w-[77%] max-w-[275px] rounded-t-xl bg-card p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" href="" className="size-8 rounded-full" />
          <div>
            <p className="text-xs font-medium">Cataloguei</p>
            <p className="text-[10px] text-foreground/80">
              Catálogo online para vender mais.
            </p>
          </div>
          <span className="ml-auto text-[9px] text-muted-foreground">
            1 Min Atras
          </span>
        </div>
        <div className="mt-3 border-t border-border pt-2 text-right">
          <span className="inline-block rounded-full border border-foreground bg-accent px-3 py-1 text-[9px] font-semibold shadow-[2px_2px_0_var(--foreground)]">
            Ver Catalogo
          </span>
        </div>
      </div>
    </section>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-page px-3 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1220px] overflow-hidden rounded-[26px] bg-card shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col">
          <BrandHeader />
          {children}
        </div>
        <DecorativePreview />
      </div>
    </main>
  );
}
