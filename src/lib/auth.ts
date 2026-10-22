/**
 * Autentikasi dan Manajemen Sesi Admin
 * Menggunakan Web Crypto API murni (HMAC-SHA256) yang kompatibel dengan Edge Runtime & Node.js
 */

export const ADMIN_CONFIG = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "adminpeduli2026",
  secret: process.env.ADMIN_SESSION_SECRET || "temanggung-peduli-super-secret-auth-key-2026",
  cookieName: "admin_session",
  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
};

const encoder = new TextEncoder();

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64url");
  }
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf-8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  sub: string;
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Membuat token sesi terenkripsi/tertanda tangan HMAC-SHA256
 */
export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    sub: username,
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + ADMIN_CONFIG.maxAgeSeconds * 1000,
  };

  const payloadString = JSON.stringify(payload);
  const b64Payload = toBase64Url(payloadString);
  const key = await getCryptoKey(ADMIN_CONFIG.secret);

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(b64Payload)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${b64Payload}.${signatureHex}`;
}

/**
 * Memvalidasi keaslian tanda tangan token dan masa berlaku sesi
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; payload?: SessionPayload }> {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false };
    }

    const [b64Payload, signatureHex] = parts;
    const key = await getCryptoKey(ADMIN_CONFIG.secret);

    // Convert hex ke Uint8Array
    const hexPairs = signatureHex.match(/.{1,2}/g);
    if (!hexPairs) {
      return { valid: false };
    }
    const signatureBytes = new Uint8Array(hexPairs.map((byte) => parseInt(byte, 16)));

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(b64Payload)
    );

    if (!isValid) {
      return { valid: false };
    }

    const payloadJson = fromBase64Url(b64Payload);
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Periksa kedaluwarsa sesi
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

/**
 * Verifikasi kredensial username & password admin
 */
export function verifyAdminCredentials(username: unknown, password: unknown): boolean {
  if (typeof username !== "string" || typeof password !== "string") {
    return false;
  }

  const validUser = ADMIN_CONFIG.username;
  const validPass = ADMIN_CONFIG.password;

  return username.trim() === validUser && password === validPass;
}
