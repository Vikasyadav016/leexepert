export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions<TBody = unknown> = {
  method: ApiMethod;
  body?: TBody;
  headers?: HeadersInit;
  token?: string;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly data: unknown;

  constructor(message: string, status: number, url: string, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.data = data;
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

function resolveUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || !apiBaseUrl) return url;
  return `${apiBaseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

async function readResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const text = await response.text();
  return text || undefined;
}

export async function apiRequest<TResponse, TBody = unknown>(
  url: string,
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const response = await fetch(resolveUrl(url), {
    method: options.method,
    headers,
    body: options.body === undefined
      ? undefined
      : isFormData
        ? options.body as BodyInit
        : JSON.stringify(options.body),
    signal: options.signal,
  });
  const data = await readResponse(response);

  if (!response.ok) {
    const serverMessage =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : response.statusText || "Request failed";
    throw new ApiError(serverMessage, response.status, response.url, data);
  }

  return data as TResponse;
}

export function get<TResponse>(url: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
  return apiRequest<TResponse>(url, { ...options, method: "GET" });
}

export function post<TResponse, TBody = unknown>(url: string, body: TBody, options: Omit<ApiRequestOptions<TBody>, "method" | "body"> = {}) {
  return apiRequest<TResponse, TBody>(url, { ...options, method: "POST", body });
}

export function put<TResponse, TBody = unknown>(url: string, body: TBody, options: Omit<ApiRequestOptions<TBody>, "method" | "body"> = {}) {
  return apiRequest<TResponse, TBody>(url, { ...options, method: "PUT", body });
}

export function patch<TResponse, TBody = unknown>(url: string, body: TBody, options: Omit<ApiRequestOptions<TBody>, "method" | "body"> = {}) {
  return apiRequest<TResponse, TBody>(url, { ...options, method: "PATCH", body });
}

export function deleteApi<TResponse, TBody = undefined>(url: string, body?: TBody, options: Omit<ApiRequestOptions<TBody>, "method" | "body"> = {}) {
  return apiRequest<TResponse, TBody>(url, { ...options, method: "DELETE", body });
}