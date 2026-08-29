const DEFAULT_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "Cataloguei";
export const SITE_SHORT_NAME = "Cataloguei";
export const SITE_TITLE = "Catálogo online para vender mais";
export const SITE_DESCRIPTION =
  "Crie uma loja virtual leve, compartilhe seu catálogo online e receba pedidos pelo WhatsApp com o Cataloguei.";
export const SITE_KEYWORDS = [
  "catalogo online",
  "catalogo digital",
  "loja virtual",
  "catalogo para whatsapp",
  "vitrine online",
  "e-commerce",
  "Cataloguei",
];
export const DEFAULT_THEME_COLOR = "#7c3aed";
export const SITE_LOCALE = "pt_BR";
export const SITE_LANGUAGE = "pt-BR";
export const DEFAULT_OG_IMAGE_PATH = "/og";
export const DEFAULT_OG_IMAGE_ALT = `Compartilhamento do ${SITE_NAME}`;
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined;
export const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || undefined;

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function ensureLeadingSlash(value: string) {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

export function normalizePublicPath(value: string) {
  const [pathWithoutHash] = value.split("#");
  const [pathWithoutQuery] = pathWithoutHash.split("?");

  if (!pathWithoutQuery || pathWithoutQuery === "/") {
    return "/";
  }

  return stripTrailingSlash(ensureLeadingSlash(pathWithoutQuery));
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL;

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  return stripTrailingSlash(configuredUrl);
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}

export function getSiteHost() {
  return getMetadataBase().host;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getMetadataBase()).toString();
}

export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function toAbsoluteAssetUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  return absoluteUrl(value.startsWith("/") ? value : `/${value}`);
}
