export class ProductImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductImageValidationError";
  }
}

const PRODUCT_IMAGE_EXTENSIONS = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
} as const;

const PRODUCT_IMAGE_MIME_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export type ProductImageKind = keyof typeof PRODUCT_IMAGE_EXTENSIONS;

export const PRODUCT_IMAGE_MAX_SIZE_BYTES = 4 * 1024 * 1024;
export const PRODUCT_IMAGE_ACCEPT = Object.values(PRODUCT_IMAGE_MIME_TYPES).join(",");
export const PRODUCT_IMAGE_ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export function formatProductImageMaxSize() {
  return "4 MB";
}

export function getProductImageFormatsLabel() {
  return "JPG, PNG, WEBP";
}

function isAllowedProductImageMimeType(value: string) {
  return Object.values(PRODUCT_IMAGE_MIME_TYPES).includes(
    value as (typeof PRODUCT_IMAGE_MIME_TYPES)[ProductImageKind]
  );
}

function getProductImageExtensionFromFileName(fileName: string) {
  const parts = fileName.toLowerCase().split(".");

  if (parts.length < 2) {
    return null;
  }

  return `.${parts.at(-1)}`;
}

function detectProductImageKind(bytes: Uint8Array): ProductImageKind | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

export async function validateProductImageFile(file: File) {
  if (!file.size) {
    throw new ProductImageValidationError("Selecione uma imagem válida.");
  }

  if (file.size > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
    throw new ProductImageValidationError(
      `A imagem deve ter no máximo ${formatProductImageMaxSize()}.`
    );
  }

  const extension = getProductImageExtensionFromFileName(file.name);

  if (
    extension &&
    !(PRODUCT_IMAGE_ALLOWED_EXTENSIONS as readonly string[]).includes(extension)
  ) {
    throw new ProductImageValidationError(
      "Formato inválido. Envie uma imagem JPG, PNG ou WEBP."
    );
  }

  if (file.type && !isAllowedProductImageMimeType(file.type)) {
    throw new ProductImageValidationError(
      "Formato inválido. Envie uma imagem JPG, PNG ou WEBP."
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectProductImageKind(bytes);

  if (!kind) {
    throw new ProductImageValidationError(
      "Não foi possível validar a imagem enviada."
    );
  }

  const detectedMimeType = PRODUCT_IMAGE_MIME_TYPES[kind];

  if (file.type && file.type !== detectedMimeType) {
    throw new ProductImageValidationError(
      "O tipo do arquivo não corresponde ao conteúdo da imagem."
    );
  }

  return {
    bytes,
    kind,
    mimeType: detectedMimeType,
  };
}

export function buildProductImageObjectKey(
  storeId: string,
  productId: string,
  kind: ProductImageKind
) {
  return `stores/${storeId}/products/${productId}/image-${crypto.randomUUID()}.${PRODUCT_IMAGE_EXTENSIONS[kind]}`;
}
