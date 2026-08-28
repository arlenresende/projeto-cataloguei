import { Prisma } from "@prisma/client";

export type PrismaErrorLike = {
  code?: string;
  meta?: {
    target?: string | string[];
    [key: string]: unknown;
  };
};

export function isPrismaKnownError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function getPrismaErrorCode(error: unknown): string | undefined {
  if (isPrismaKnownError(error)) {
    return error.code;
  }
  if (error instanceof Error && "code" in error) {
    const code = (error as PrismaErrorLike).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

export function getPrismaErrorTarget(error: unknown): string[] {
  if (isPrismaKnownError(error)) {
    const target = error.meta?.target;
    if (Array.isArray(target)) {
      return target.filter((t): t is string => typeof t === "string");
    }
    if (typeof target === "string") {
      return [target];
    }
  }
  if (error instanceof Error && "code" in error) {
    const meta = (error as PrismaErrorLike).meta;
    const target = meta?.target;
    if (Array.isArray(target)) {
      return target.filter((t): t is string => typeof t === "string");
    }
    if (typeof target === "string") {
      return [target];
    }
  }
  return [];
}

export function prismaTargetIncludes(
  error: unknown,
  field: string
): boolean {
  return getPrismaErrorTarget(error).some((t) => t.includes(field));
}
