import { z } from "zod";

export const storeHeroSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título do hero.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .max(300, "A descrição deve ter no máximo 300 caracteres.")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .url("Informe uma URL válida para a imagem.")
    .optional()
    .or(z.literal("")),
  bgColor: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),
  textColor: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),
  alignment: z.enum(["LEFT", "CENTER", "RIGHT"]),
  buttonText: z
    .string()
    .max(50, "O texto do botão deve ter no máximo 50 caracteres.")
    .optional()
    .or(z.literal("")),
  buttonUrl: z
    .string()
    .max(500, "A URL do botão deve ter no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
  position: z.coerce
    .number()
    .int()
    .min(0, "A posição deve ser um número positivo."),
  isActive: z.boolean(),
});

export type StoreHeroFormData = z.infer<typeof storeHeroSchema>;
