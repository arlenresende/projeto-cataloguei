import { z } from "zod";
import { storeSchema, generateSlug } from "@/lib/schemas/store";

// Onboarding requires name, slug, and description
export const onboardingSchema = storeSchema
  .pick({ name: true, slug: true })
  .extend({
    description: z
      .string()
      .min(10, "Digite uma descrição para sua loja.")
      .max(200, "A descrição deve ter no máximo 200 caracteres."),
  });

export type OnboardingFormInput = z.input<typeof onboardingSchema>;
export type OnboardingFormData = z.output<typeof onboardingSchema>;

export { generateSlug };
