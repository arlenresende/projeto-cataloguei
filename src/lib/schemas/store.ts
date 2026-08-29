import { StoreThemeSegment } from "@prisma/client";
import { z } from "zod";

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function optionalText(max: number) {
  return z.preprocess(
    trimString,
    z.string().max(max).optional().or(z.literal(""))
  );
}

function optionalUrl() {
  return z.preprocess(
    trimString,
    z.string().url("Informe uma URL válida.").optional().or(z.literal(""))
  );
}

function optionalEmail() {
  return z.preprocess(
    trimString,
    z.string().email("Informe um email válido.").optional().or(z.literal(""))
  );
}

function optionalHexColor() {
  return z.preprocess(
    trimString,
    z
      .string()
      .regex(
        /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        "Informe uma cor hexadecimal válida."
      )
      .optional()
      .or(z.literal(""))
  );
}

/** Telefone BR: 10 ou 11 dígitos */
function optionalPhone() {
  return z.preprocess(
    trimString,
    z
      .string()
      .refine(
        (v) => !v || /^\d{10,11}$/.test(v),
        "Informe um telefone válido (10 ou 11 dígitos)."
      )
      .optional()
      .or(z.literal(""))
  );
}

/** CEP: 8 dígitos */
function optionalCEP() {
  return z.preprocess(
    trimString,
    z
      .string()
      .refine(
        (v) => !v || /^\d{8}$/.test(v),
        "Informe um CEP válido (8 dígitos)."
      )
      .optional()
      .or(z.literal(""))
  );
}

export function normalizeStoreSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const storeThemeSchema = z.nativeEnum(StoreThemeSegment);

const baseStoreSchema = z.object({
  name: z.preprocess(
    trimString,
    z
      .string()
      .min(2, "Informe o nome da sua loja.")
      .max(50, "O nome deve ter no máximo 50 caracteres.")
  ),
  slug: z.preprocess(
    (value) =>
      typeof value === "string" ? normalizeStoreSlug(value) : value,
    z
      .string()
      .min(2, "Escolha um endereço válido para sua loja.")
      .max(40, "O endereço deve ter no máximo 40 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use apenas letras minúsculas, números e hífens."
      )
  ),
  description: optionalText(500),
  address: optionalText(200),
  city: optionalText(100),
  state: optionalText(100),
  postalCode: optionalCEP(),
  country: optionalText(100),
  email: optionalEmail(),
  logo: optionalUrl(),
  websiteUrl: optionalUrl(),
  whatsappUrl: optionalPhone(),
  instagramUrl: optionalUrl(),
  facebookUrl: optionalUrl(),
  phoneNumber: optionalPhone(),
  cellPhone: optionalPhone(),
  primaryColor: optionalHexColor(),
  secondaryColor: optionalHexColor(),
  hideCatalogueiBranding: z.boolean().optional(),
  themeStore: storeThemeSchema.optional(),
  isActive: z.boolean().optional(),
});

export const storeSchema = baseStoreSchema;

export const storeCreateSchema = baseStoreSchema
  .omit({ isActive: true })
  .strict();

export const storeUpdateSchema = baseStoreSchema.partial().strict();

export type StoreFormInput = z.input<typeof storeSchema>;
export type StoreFormData = z.output<typeof storeSchema>;
export type StoreCreateInput = z.output<typeof storeCreateSchema>;
export type StoreUpdateInput = z.output<typeof storeUpdateSchema>;

export function generateSlug(name: string): string {
  return normalizeStoreSlug(name);
}
