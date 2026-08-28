import { z } from "zod";
import { normalizeStoreSlug } from "./store";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(150, "O nome deve ter no máximo 150 caracteres.")
    .transform((v) => v.trim()),
  slug: z
    .string()
    .min(2, "O slug deve ter pelo menos 2 caracteres.")
    .max(160, "O slug deve ter no máximo 160 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    )
    .transform((v) => normalizeStoreSlug(v)),
  categoryId: z.string().optional().or(z.literal("")),
  description: z.any().optional(),
  descriptionHtml: z.string().optional().or(z.literal("")),
  sku: z
    .string()
    .max(60, "O SKU deve ter no máximo 60 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
  barcode: z
    .string()
    .max(50, "O código de barras deve ter no máximo 50 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
  brand: z
    .string()
    .max(80, "A marca deve ter no máximo 80 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
  price: z.coerce
    .number()
    .min(0.01, "O preço deve ser maior que zero."),
  compareAtPrice: z.coerce
    .number()
    .min(0, "O preço promocional não pode ser negativo.")
    .optional()
    .nullable(),
  stock: z.coerce
    .number()
    .int()
    .min(0, "O estoque não pode ser negativo.")
    .default(0),
  minStock: z.coerce
    .number()
    .int()
    .min(0, "O estoque mínimo não pode ser negativo.")
    .optional()
    .nullable(),
  weight: z.coerce
    .number()
    .min(0, "O peso não pode ser negativo.")
    .optional()
    .nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  seoTitle: z
    .string()
    .max(70, "O título SEO deve ter no máximo 70 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
  seoDescription: z
    .string()
    .max(160, "A descrição SEO deve ter no máximo 160 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
});

export const productCreateSchema = productSchema;
export const productUpdateSchema = productSchema.partial().strict();

export type ProductFormData = z.output<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductUpdateInput = z.output<typeof productUpdateSchema>;
