import "server-only";

import { asaasRequest } from "@/lib/asaas/client";

export type AsaasCustomer = {
  id: string;
  name: string;
  email?: string | null;
  mobilePhone?: string | null;
  externalReference?: string | null;
};

export async function createAsaasCustomer(input: {
  name: string;
  email: string;
  phone?: string | null;
  externalReference?: string;
}) {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: {
      name: input.name,
      email: input.email,
      mobilePhone: input.phone || undefined,
      externalReference: input.externalReference,
    },
  });
}
