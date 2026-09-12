import { describe, expect, it } from "vitest";
import {
  isReservedStoreSlug,
  normalizeStoreSlug,
  storeCreateSchema,
} from "@/lib/schemas/store";

const validStoreInput = {
  name: "Loja Modelo",
  slug: "loja-modelo",
};

describe("store schema", () => {
  it("normaliza slugs de loja", () => {
    expect(normalizeStoreSlug("  Minha Loja Ágil!!  ")).toBe(
      "minha-loja-agil"
    );
  });

  it("bloqueia slugs reservados para rotas internas", () => {
    for (const slug of ["admin", "api", "login", "privacy", "terms", "og"]) {
      expect(storeCreateSchema.safeParse({ ...validStoreInput, slug }).success).toBe(
        false
      );
    }
  });

  it("bloqueia slug reservado apos normalizacao", () => {
    expect(isReservedStoreSlug(" Administração ")).toBe(false);
    expect(isReservedStoreSlug("API")).toBe(true);
    expect(
      storeCreateSchema.safeParse({ ...validStoreInput, slug: " API " }).success
    ).toBe(false);
  });

  it("permite slug valido de loja", () => {
    expect(
      storeCreateSchema.safeParse({ ...validStoreInput, slug: "minha-loja" })
        .success
    ).toBe(true);
  });
});
