import { z } from "zod";
import { onlyNumbers } from "@/lib/masks";

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function optionalText(max: number) {
  return z.preprocess(
    trimString,
    z.string().max(max).optional().or(z.literal(""))
  );
}

export const landingLeadSchema = z.object({
  name: z.preprocess(
    trimString,
    z
      .string()
      .min(2, "Informe seu nome.")
      .max(80, "O nome deve ter no máximo 80 caracteres.")
  ),
  email: z.preprocess(
    trimString,
    z.string().email("Informe um e-mail válido.").optional().or(z.literal(""))
  ),
  whatsapp: z.preprocess(
    (value) => (typeof value === "string" ? onlyNumbers(value) : value),
    z
      .string()
      .min(10, "Informe um WhatsApp válido.")
      .max(13, "Informe um WhatsApp válido.")
  ),
  businessType: optionalText(80),
  currentSalesChannel: optionalText(80),
  monthlyOrders: optionalText(40),
  message: optionalText(500),
  source: optionalText(80),
  utmSource: optionalText(120),
  utmMedium: optionalText(120),
  utmCampaign: optionalText(160),
  utmTerm: optionalText(160),
  utmContent: optionalText(160),
});

export type LandingLeadInput = z.output<typeof landingLeadSchema>;
