import "server-only";

import path from "node:path";
import { config as loadEnv } from "dotenv";

type AsaasRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: URLSearchParams;
};

type AsaasErrorItem = {
  code?: string;
  description?: string;
};

type AsaasErrorResponse = {
  errors?: AsaasErrorItem[];
};

export class AsaasApiError extends Error {
  status: number;
  details: AsaasErrorItem[];

  constructor(message: string, status: number, details: AsaasErrorItem[] = []) {
    super(message);
    this.name = "AsaasApiError";
    this.status = status;
    this.details = details;
  }
}

let envFallbackLoaded = false;

function ensureAsaasEnvLoaded() {
  if (envFallbackLoaded) {
    return;
  }

  envFallbackLoaded = true;

  const envPath = path.join(process.cwd(), ".env.local");
  loadEnv({ path: envPath, override: false });
}

function getAsaasConfig() {
  ensureAsaasEnvLoaded();

  const apiKey = process.env.ASAAS_API_KEY?.trim();
  const apiUrl = process.env.ASAAS_API_URL?.trim();

  if (!apiKey) {
    throw new Error("ASAAS_API_KEY não está definida no servidor.");
  }

  if (!apiUrl) {
    throw new Error("ASAAS_API_URL não está definida no servidor.");
  }

  return {
    apiKey,
    apiUrl: apiUrl.replace(/\/$/, ""),
  };
}

export async function asaasRequest<T>(
  path: string,
  options: AsaasRequestOptions = {}
) {
  const { apiKey, apiUrl } = getAsaasConfig();
  const url = new URL(`${apiUrl}${path.startsWith("/") ? path : `/${path}`}`);

  if (options.searchParams) {
    url.search = options.searchParams.toString();
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Cataloguei/1.0.0",
      access_token: apiKey,
    },
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Erro ao se comunicar com o Asaas.";
    let details: AsaasErrorItem[] = [];

    try {
      const payload = (await response.json()) as AsaasErrorResponse;
      details = payload.errors || [];
      if (details[0]?.description) {
        errorMessage = details[0].description;
      }
    } catch {
      // noop
    }

    throw new AsaasApiError(errorMessage, response.status, details);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
