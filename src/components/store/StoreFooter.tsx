"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

interface StoreFooterProps {
  name: string;
  storeUrl: string;
  description: string;
  whatsapp?: string;
}

export function StoreFooter({ name, storeUrl, description, whatsapp }: StoreFooterProps) {
  const { resolvedColors } = useTheme();

  return (
    <footer
      className="border-t"
      style={{
        borderColor: resolvedColors.secondary + "15",
        backgroundColor: resolvedColors.secondary,
        color: resolvedColors.cardBg,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href={`/${storeUrl}`}
              className="flex items-center gap-3"
              aria-label={`${name} - Página inicial`}
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl text-base font-extrabold"
                style={{
                  backgroundColor: resolvedColors.primary,
                  color: resolvedColors.secondary,
                }}
              >
                {name.charAt(0)}
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                {name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm font-medium opacity-60">
              {description}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold">
              Navegação
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Produtos", href: `/${storeUrl}` },
                { label: "Contato", href: `/${storeUrl}#contato` },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium transition-colors hover:opacity-100"
                    style={{ opacity: 0.6 }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold">
              Contato
            </p>
            <ul className="mt-4 space-y-3">
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors hover:opacity-100"
                    style={{ opacity: 0.6 }}
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              <li>
                <span className="text-sm font-medium opacity-60">
                  Suporte online
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold">
              Informações
            </p>
            <ul className="mt-4 space-y-3">
              {["Sobre nós", "Política de privacidade", "Termos de uso"].map(
                (label) => (
                  <li key={label}>
                    <span className="text-sm font-medium opacity-60">
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-8"
          style={{ borderColor: resolvedColors.cardBg + "15" }}
        >
          <p className="text-center text-xs font-medium opacity-40">
            &copy; {new Date().getFullYear()} {name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
