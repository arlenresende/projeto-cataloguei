import Link from "next/link";
import { Store } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#features" },
      { label: "Temas", href: "#themes" },
      { label: "Como funciona", href: "#how-it-works" },
      { label: "Preços", href: "#pricing" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contato", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Privacidade", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="Cataloguei - Página inicial"
            >
              <span
                className="flex size-9 items-center justify-center rounded-lg bg-violet-600 text-white"
                aria-hidden="true"
              >
                <Store className="size-5" />
              </span>
              <span className="text-lg font-bold text-zinc-900">
                Cataloguei
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500">
              Catálogos online para pequenos negócios. Comece grátis e venda
              pelo WhatsApp.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold text-zinc-900">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 md:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Cataloguei. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-zinc-500">
            Feito com carinho para pequenos negócios.
          </p>
        </div>
      </div>
    </footer>
  );
}
