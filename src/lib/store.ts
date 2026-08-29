import { Prisma, StoreThemeSegment } from "@prisma/client";
import type { StoreCreateInput, StoreUpdateInput } from "@/lib/schemas/store";

export const storeAdminSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  email: true,
  logo: true,
  websiteUrl: true,
  whatsappUrl: true,
  instagramUrl: true,
  facebookUrl: true,
  phoneNumber: true,
  cellPhone: true,
  primaryColor: true,
  secondaryColor: true,
  hideCatalogueiBranding: true,
  themeStore: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StoreSelect;

function nullableText(value: string | undefined) {
  return value ? value : null;
}

export function buildStoreCreateData(
  data: StoreCreateInput,
  userId: string
): Prisma.StoreUncheckedCreateInput {
  return {
    name: data.name,
    slug: data.slug,
    description: nullableText(data.description),
    address: nullableText(data.address),
    city: nullableText(data.city),
    state: nullableText(data.state),
    postalCode: nullableText(data.postalCode),
    country: nullableText(data.country),
    email: nullableText(data.email),
    logo: nullableText(data.logo),
    websiteUrl: nullableText(data.websiteUrl),
    whatsappUrl: nullableText(data.whatsappUrl),
    instagramUrl: nullableText(data.instagramUrl),
    facebookUrl: nullableText(data.facebookUrl),
    phoneNumber: nullableText(data.phoneNumber),
    cellPhone: nullableText(data.cellPhone),
    primaryColor: nullableText(data.primaryColor),
    secondaryColor: nullableText(data.secondaryColor),
    hideCatalogueiBranding: data.hideCatalogueiBranding ?? false,
    themeStore: data.themeStore ?? StoreThemeSegment.DEFAULT,
    isActive: true,
    userId,
  };
}

export function buildStoreUpdateData(
  data: StoreUpdateInput
): Prisma.StoreUncheckedUpdateInput {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.description !== undefined && {
      description: nullableText(data.description),
    }),
    ...(data.address !== undefined && { address: nullableText(data.address) }),
    ...(data.city !== undefined && { city: nullableText(data.city) }),
    ...(data.state !== undefined && { state: nullableText(data.state) }),
    ...(data.postalCode !== undefined && {
      postalCode: nullableText(data.postalCode),
    }),
    ...(data.country !== undefined && { country: nullableText(data.country) }),
    ...(data.email !== undefined && { email: nullableText(data.email) }),
    ...(data.logo !== undefined && { logo: nullableText(data.logo) }),
    ...(data.websiteUrl !== undefined && {
      websiteUrl: nullableText(data.websiteUrl),
    }),
    ...(data.whatsappUrl !== undefined && {
      whatsappUrl: nullableText(data.whatsappUrl),
    }),
    ...(data.instagramUrl !== undefined && {
      instagramUrl: nullableText(data.instagramUrl),
    }),
    ...(data.facebookUrl !== undefined && {
      facebookUrl: nullableText(data.facebookUrl),
    }),
    ...(data.phoneNumber !== undefined && {
      phoneNumber: nullableText(data.phoneNumber),
    }),
    ...(data.cellPhone !== undefined && {
      cellPhone: nullableText(data.cellPhone),
    }),
    ...(data.primaryColor !== undefined && {
      primaryColor: nullableText(data.primaryColor),
    }),
    ...(data.secondaryColor !== undefined && {
      secondaryColor: nullableText(data.secondaryColor),
    }),
    ...(data.hideCatalogueiBranding !== undefined && {
      hideCatalogueiBranding: data.hideCatalogueiBranding,
    }),
    ...(data.themeStore !== undefined && { themeStore: data.themeStore }),
    ...(data.isActive !== undefined && { isActive: data.isActive }),
  };
}

export function getStoreConflictMessage(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code !== "P2002") {
    return null;
  }

  const target = Array.isArray(error.meta?.target)
    ? error.meta.target
    : typeof error.meta?.target === "string"
      ? [error.meta.target]
      : [];

  if (target.includes("userId")) {
    return "Você já possui uma loja cadastrada.";
  }

  if (target.includes("slug")) {
    return "Esse endereço já está em uso. Escolha outro.";
  }

  return "Não foi possível salvar a loja com os dados informados.";
}
