import { z } from "zod";
import { storeSchema, generateSlug } from "@/lib/schemas/store";
import { onlyNumbers } from "@/lib/masks";

// Onboarding requires name, slug, description, and WhatsApp.
export const onboardingSchema = storeSchema
  .pick({ name: true, slug: true })
  .extend({
    whatsappUrl: z
      .string()
      .min(1, "Informe o WhatsApp da loja.")
      .transform(onlyNumbers)
      .pipe(z.string().regex(/^\d{10,11}$/, "Informe um WhatsApp válido com DDD (10 ou 11 dígitos).")),
    description: z
      .string()
      .min(10, "Digite uma descrição para sua loja.")
      .max(200, "A descrição deve ter no máximo 200 caracteres."),
  });

export type OnboardingFormInput = z.input<typeof onboardingSchema>;
export type OnboardingFormData = z.output<typeof onboardingSchema>;

export { generateSlug };
