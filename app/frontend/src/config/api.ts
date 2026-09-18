/**
 * Centralized API Configuration for Yojana Saathi
 *
 * Fallback Priority:
 * 1. NEXT_PUBLIC_API_BASE_URL (Build-time / runtime environment variable)
 * 2. Safe production fallback to https://yojana-saathi-dnds.onrender.com
 * 3. http://localhost:8000 ONLY for genuine local development
 *
 * Guaranteed: Production browser code NEVER falls back to localhost.
 */

export const PRODUCTION_BACKEND_URL = "https://yojana-saathi-dnds.onrender.com";
export const LOCAL_BACKEND_URL = "http://localhost:8000";

export function getApiBaseUrl(): string {
  // 1. Explicit environment variable (if set in Vercel / local .env)
  const envUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.BACKEND_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""
  ).trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // 2. Browser runtime: detect if running locally or in production
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local");

    if (isLocalhost) {
      return LOCAL_BACKEND_URL;
    }

    // Any remote/production browser origin (e.g. yojana-saathi-hazel.vercel.app)
    return PRODUCTION_BACKEND_URL;
  }

  // 3. Server runtime (Next.js server-side route handlers / SSR)
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return PRODUCTION_BACKEND_URL;
  }

  return LOCAL_BACKEND_URL;
}

/**
 * Builds a clean API URL with no double slashes.
 * e.g. buildApiUrl("/api/eligibility/check") -> "https://yojana-saathi-dnds.onrender.com/api/eligibility/check"
 */
export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
