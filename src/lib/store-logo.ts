export class StoreLogoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreLogoValidationError";
  }
}

const STORE_LOGO_EXTENSIONS = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
} as const;

const STORE_LOGO_MIME_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export type StoreLogoKind = keyof typeof STORE_LOGO_EXTENSIONS;

export const STORE_LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;
export const STORE_LOGO_ACCEPT = Object.values(STORE_LOGO_MIME_TYPES).join(",");
export const STORE_LOGO_ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export function formatStoreLogoMaxSize() {
  return "2 MB";
}

export function getStoreLogoFormatsLabel() {
  return "JPG, PNG, WEBP";
}

export function isAllowedStoreLogoMimeType(value: string) {
  return Object.values(STORE_LOGO_MIME_TYPES).includes(
    value as (typeof STORE_LOGO_MIME_TYPES)[StoreLogoKind]
  );
}

export function getStoreLogoExtensionFromKind(kind: StoreLogoKind) {
  return STORE_LOGO_EXTENSIONS[kind];
}

export function getStoreLogoExtensionFromFileName(fileName: string) {
  const parts = fileName.toLowerCase().split(".");

  if (parts.length < 2) {
    return null;
  }

  return `.${parts.at(-1)}`;
}

export function detectStoreLogoKind(bytes: Uint8Array): StoreLogoKind | null {
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

export async function validateStoreLogoFile(file: File) {
  if (!file.size) {
    throw new StoreLogoValidationError("Selecione uma imagem válida.");
  }

  if (file.size > STORE_LOGO_MAX_SIZE_BYTES) {
    throw new StoreLogoValidationError(
      `A logo deve ter no máximo ${formatStoreLogoMaxSize()}.`
    );
  }

  const extension = getStoreLogoExtensionFromFileName(file.name);

  if (
    extension &&
    !(STORE_LOGO_ALLOWED_EXTENSIONS as readonly string[]).includes(extension)
  ) {
    throw new StoreLogoValidationError(
      "Formato inválido. Envie uma imagem JPG, PNG ou WEBP."
    );
  }

  if (file.type && !isAllowedStoreLogoMimeType(file.type)) {
    throw new StoreLogoValidationError(
      "Formato inválido. Envie uma imagem JPG, PNG ou WEBP."
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectStoreLogoKind(bytes);

  if (!kind) {
    throw new StoreLogoValidationError(
      "Não foi possível validar a imagem enviada."
    );
  }

  const detectedMimeType = STORE_LOGO_MIME_TYPES[kind];

  if (file.type && file.type !== detectedMimeType) {
    throw new StoreLogoValidationError(
      "O tipo do arquivo não corresponde ao conteúdo da imagem."
    );
  }

  return {
    bytes,
    kind,
    mimeType: detectedMimeType,
  };
}

export function buildStoreLogoObjectKey(storeId: string, kind: StoreLogoKind) {
  return `stores/${storeId}/logo/logo-${crypto.randomUUID()}.${getStoreLogoExtensionFromKind(kind)}`;
}

export function extractSupabaseStorageObjectKey(
  fileUrl: string,
  bucketName: string
) {
  try {
    const url = new URL(fileUrl);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}
