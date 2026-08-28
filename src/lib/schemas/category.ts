import { z } from "zod";
import { normalizeStoreSlug } from "./store";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres.")
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(300, "A descrição deve ter no máximo 300 caracteres.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : v)),
  slug: z
    .string()
    .min(2, "O slug deve ter pelo menos 2 caracteres.")
    .max(80, "O slug deve ter no máximo 80 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    )
    .transform((v) => normalizeStoreSlug(v)),
  isActive: z.boolean().default(true),
});

export const categoryCreateSchema = categorySchema;
export const categoryUpdateSchema = categorySchema.partial().strict();

export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormData = z.output<typeof categorySchema>;
export type CategoryUpdateInput = z.output<typeof categoryUpdateSchema>;

export const CATEGORY_SUGGESTIONS = [
  "Roupas",
  "Calçados",
  "Acessórios",
  "Eletrônicos",
  "Casa",
  "Beleza",
  "Alimentos",
  "Bebidas",
  "Esportes",
  "Infantil",
  "Outros",
] as const;
