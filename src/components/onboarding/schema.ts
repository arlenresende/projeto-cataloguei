import { z } from "zod";

export const createStoreSchema = z.object({
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
    .min(10, "Digite uma descrição para sua loja.")
    .max(200, "A descrição deve ter no máximo 200 caracteres."),
});

export type CreateStoreFormData = z.infer<typeof createStoreSchema>;

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
