import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(2, "Informe o nome da sua loja.")
    .max(50, "O nome deve ter no máximo 50 caracteres."),
  slug: z
    .string()
    .min(2, "Escolha um endereço válido para sua loja.")
    .max(40, "O endereço deve ter no máximo 40 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    ),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  state: z.string().max(100).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  email: z
    .string()
    .email("Informe um email válido.")
    .optional()
    .or(z.literal("")),
  logo: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  websiteUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  whatsappUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  instagramUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  facebookUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  phoneNumber: z.string().max(20).optional().or(z.literal("")),
  cellPhone: z.string().max(20).optional().or(z.literal("")),
  themeStore: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
