"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

interface StoreFooterProps {
  name: string;
  storeUrl: string;
  logoUrl?: string | null;
  description: string;
  whatsapp?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
}

export function StoreFooter({
  name,
  storeUrl,
  logoUrl,
  description,
  whatsapp,
  email,
  phone,
  address,
  city,
  state,
  postalCode,
  websiteUrl,
  instagramUrl,
  facebookUrl,
}: StoreFooterProps) {
  const { resolvedColors } = useTheme();

  const hasAddress = address || city || postalCode;
  const hasContact = email || phone || whatsapp;
  const hasSocial = websiteUrl || instagramUrl || facebookUrl;

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
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              href={`/${storeUrl}`}
              className={`flex items-center ${logoUrl ? "gap-0" : "gap-3"}`}
              aria-label={`${name} - Página inicial`}
            >
              <span
                className={`relative flex items-center justify-center overflow-hidden text-base font-extrabold ${
                  logoUrl ? "h-14 w-36 rounded-2xl" : "size-10 rounded-xl"
                }`}
                style={{
                  backgroundColor: resolvedColors.primary,
                  color: resolvedColors.secondary,
                }}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`Logo de ${name}`}
                    fill
                    className="bg-white object-contain p-2"
                    sizes="144px"
                  />
                ) : (
                  name.charAt(0)
                )}
              </span>
              {!logoUrl ? (
                <span className="text-xl font-extrabold tracking-tight">
                  {name}
                </span>
              ) : null}
            </Link>
            {description && (
              <p className="mt-4 max-w-xs text-sm font-medium opacity-60">
                {description}
              </p>
            )}
          </div>

          {/* Address */}
          {hasAddress && (
            <div>
              <p className="text-sm font-bold">Endereço</p>
              <ul className="mt-4 space-y-2">
                {address && (
                  <li className="text-sm font-medium opacity-60">{address}</li>
                )}
                {(city || state) && (
                  <li className="text-sm font-medium opacity-60">
                    {city}{state ? ` - ${state}` : ""}
                  </li>
                )}
                {postalCode && (
                  <li className="text-sm font-medium opacity-60">
                    CEP: {postalCode}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Contact */}
          {hasContact && (
            <div>
              <p className="text-sm font-bold">Contato</p>
              <ul className="mt-4 space-y-2">
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium transition-colors hover:opacity-100"
                      style={{ opacity: 0.6 }}
                    >
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li className="text-sm font-medium opacity-60">
                    {phone}
                  </li>
                )}
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
              </ul>
            </div>
          )}

          {/* Social */}
          {hasSocial && (
            <div>
              <p className="text-sm font-bold">Redes sociais</p>
              <ul className="mt-4 space-y-2">
                {websiteUrl && (
                  <li>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition-colors hover:opacity-100"
                      style={{ opacity: 0.6 }}
                    >
                      Website
                    </a>
                  </li>
                )}
                {instagramUrl && (
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition-colors hover:opacity-100"
                      style={{ opacity: 0.6 }}
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {facebookUrl && (
                  <li>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition-colors hover:opacity-100"
                      style={{ opacity: 0.6 }}
                    >
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div
          className="mt-12 border-t pt-8"
          style={{ borderColor: resolvedColors.cardBg + "15" }}
        >
          <p className="text-center text-xs font-medium opacity-40">
            &copy; {new Date().getFullYear()}{" "}
            {logoUrl ? "Todos os direitos reservados." : `${name}. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
