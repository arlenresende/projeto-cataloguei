import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const FOOTER_LINKS = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#features" },
      { label: "Demonstração", href: "#showcase" },
      { label: "Como funciona", href: "#how-it-works" },
      { label: "Preços", href: "#pricing" },
    ],
  },
  {
    title: "Acesso",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
      { label: "Falar com a gente", href: "#contato" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Contato", href: "#contato" },
      { label: "Planos", href: "#pricing" },
      { label: "Criar catálogo", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/privacy" },
      { label: "Termos de uso", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-tertiary)] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo variant="footer" />
            <p className="mt-3 text-sm text-muted-foreground">
              Catálogo online para vender mais. Comece grátis e receba pedidos
              pelo WhatsApp.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold text-[var(--brand-black)]">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-[var(--brand-black)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--brand-border)] pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Cataloguei. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com carinho para pequenos negócios.
          </p>
        </div>
      </div>
    </footer>
  );
}
