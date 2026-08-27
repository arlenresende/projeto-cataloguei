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
        borderColor: resolvedColors.border,
        backgroundColor: resolvedColors.cardBg,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href={`/${storeUrl}`}
              className="flex items-center gap-2.5"
              aria-label={`${name} - Página inicial`}
            >
              <span
                className="flex size-8 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: resolvedColors.primary,
                  color: resolvedColors.secondary,
                }}
              >
                {name.charAt(0)}
              </span>
              <span
                className="text-base font-bold"
                style={{ color: resolvedColors.text }}
              >
                {name}
              </span>
            </Link>
            <p
              className="mt-3 text-sm"
              style={{ color: resolvedColors.text, opacity: 0.6 }}
            >
              {description}
            </p>
          </div>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: resolvedColors.text }}
            >
              Navegação
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Produtos", href: `/${storeUrl}` },
                { label: "Contato", href: `/${storeUrl}#contato` },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: resolvedColors.text, opacity: 0.6 }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: resolvedColors.text }}
            >
              Contato
            </p>
            <ul className="mt-4 space-y-2.5">
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors"
                    style={{ color: resolvedColors.text, opacity: 0.6 }}
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              <li>
                <span
                  className="text-sm"
                  style={{ color: resolvedColors.text, opacity: 0.6 }}
                >
                  Suporte online
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: resolvedColors.text }}
            >
              Informações
            </p>
            <ul className="mt-4 space-y-2.5">
              {["Sobre nós", "Política de privacidade", "Termos de uso"].map(
                (label) => (
                  <li key={label}>
                    <span
                      className="text-sm"
                      style={{ color: resolvedColors.text, opacity: 0.6 }}
                    >
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6"
          style={{ borderColor: resolvedColors.border }}
        >
          <p
            className="text-center text-xs"
            style={{ color: resolvedColors.text, opacity: 0.4 }}
          >
            &copy; {new Date().getFullYear()} {name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
