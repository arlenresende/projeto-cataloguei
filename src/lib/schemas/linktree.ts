import { z } from "zod";

export const linkSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, "Informe o título do link.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  url: z
    .string()
    .min(1, "Informe a URL do link.")
    .url("Informe uma URL válida."),
  linkType: z.string().optional().or(z.literal("")),
  order: z.number().int().min(0),
});

export const linktreeSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título do Linktree.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .max(300, "A descrição deve ter no máximo 300 caracteres.")
    .optional()
    .or(z.literal("")),
  backgroundColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Informe uma cor HEX válida.")
    .optional()
    .or(z.literal("")),
  textColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Informe uma cor HEX válida.")
    .optional()
    .or(z.literal("")),
  links: z.array(linkSchema),
});

export type LinktreeFormData = z.output<typeof linktreeSchema>;
export type LinkFormData = z.output<typeof linkSchema>;

export type LinktreeLinkPayload = {
  id: string;
  title: string;
  url: string;
  linkType: string | null;
  order: number;
};

export type LinktreePayload = {
  id: string;
  title: string;
  description: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  links: LinktreeLinkPayload[];
};
