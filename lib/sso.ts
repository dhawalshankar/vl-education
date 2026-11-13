// lib/sso.ts
export type SSOErrorKind =
  | "ACCOUNT_NOT_FOUND"
  | "CODE_EXPIRED"
  | "INACTIVE"
  | "SERVER_BUSY"
  | "UNKNOWN";

export class SSOError extends Error {
  constructor(
    message: string,
    public readonly kind: SSOErrorKind,
    public readonly status?: number
  ) {
    super(message);
    this.name = "SSOError";
  }
}

export interface SSOUser {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "instructor" | "admin";
  avatar_url?: string | null;
  vartalang_user_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

const MAIN_API = (process.env.NEXT_PUBLIC_MAIN_API_URL || "https://api.vartalang.in").replace(/\/$/, "");
const LMS_API = (process.env.NEXT_PUBLIC_LMS_API_URL || "https://vl-lms-backend.onrender.com").replace(/\/$/, "");

const parseBody = async (response: Response): Promise<Record<string, unknown>> =>
  response.json().catch(() => ({}));

const messageFrom = (body: Record<string, unknown>, fallback: string) => {
  if (typeof body.detail === "string") return body.detail;
  if (typeof body.error === "string") return body.error;
  if (typeof body.message === "string") return body.message;
  return fallback;
};

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60_000);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      if ((response.status !== 502 && response.status !== 503) || attempt === 1) {
        return response;
      }
    } catch (error) {
      if (attempt === 1) {
        const message = error instanceof DOMException && error.name === "AbortError"
          ? "The server took too long to respond."
          : "The server could not be reached.";
        throw new SSOError(message, "SERVER_BUSY");
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }
  throw new SSOError("The server is waking up. Please try again.", "SERVER_BUSY");
}

const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

async function readExchange(response: Response): Promise<{ access_token: string; user: SSOUser }> {
  const body = await parseBody(response);
  if (!response.ok) {
    if (response.status === 401) {
      throw new SSOError("Your login link expired, please try again", "CODE_EXPIRED", response.status);
    }
    if (response.status === 403) {
      throw new SSOError("This account is inactive.", "INACTIVE", response.status);
    }
    throw new SSOError(messageFrom(body, "Could not complete sign-in."), "UNKNOWN", response.status);
  }
  if (typeof body.access_token !== "string" || !body.user) {
    throw new SSOError("The sign-in response was invalid.", "UNKNOWN", response.status);
  }
  return { access_token: body.access_token, user: body.user as SSOUser };
}

export async function exchangeCode(code: string) {
  return readExchange(
    await post(`${LMS_API}/api/v1/auth/sso/exchange`, { code })
  );
}

export async function loginWithGoogleAccessToken(googleAccessToken: string) {
  const mainResponse = await post(`${MAIN_API}/auth/google-login`, {
    googleAccessToken,
  });
  const mainBody = await parseBody(mainResponse);
  if (!mainResponse.ok) {
    if (mainResponse.status === 404) {
      throw new SSOError(
        "No VartaLang account for this Google email.",
        "ACCOUNT_NOT_FOUND",
        mainResponse.status
      );
    }
    throw new SSOError(
      messageFrom(mainBody, "Google sign-in failed."),
      mainResponse.status === 502 || mainResponse.status === 503 ? "SERVER_BUSY" : "UNKNOWN",
      mainResponse.status
    );
  }
  const mainToken = typeof mainBody.token === "string" ? mainBody.token : "";
  if (!mainToken) throw new SSOError("Google sign-in failed.", "UNKNOWN", mainResponse.status);

  const codeResponse = await post(`${MAIN_API}/sso/code`, undefined, {
    Authorization: `Bearer ${mainToken}`,
  });
  const codeBody = await parseBody(codeResponse);
  if (!codeResponse.ok || typeof codeBody.code !== "string") {
    throw new SSOError(
      messageFrom(codeBody, "Could not start sign-in."),
      codeResponse.status === 502 || codeResponse.status === 503 ? "SERVER_BUSY" : "UNKNOWN",
      codeResponse.status
    );
  }
  return exchangeCode(codeBody.code);
}
