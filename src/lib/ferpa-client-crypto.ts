export type EncryptedPayload = {
  iv: string;
  data: string;
  v: 1;
};

const KEY_STORAGE = "behaviorschool_ferpa_key_v1";

function bufToB64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function b64ToBuf(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function getKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_STORAGE);
  if (stored) {
    const raw = b64ToBuf(stored);
    return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const raw = await crypto.subtle.exportKey("raw", key);
  localStorage.setItem(KEY_STORAGE, bufToB64(raw));
  return key;
}

export async function encryptJson(data: unknown): Promise<EncryptedPayload> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return { v: 1, iv: bufToB64(iv.buffer), data: bufToB64(cipher) };
}

export async function decryptJson<T>(payload: EncryptedPayload): Promise<T | null> {
  try {
    const key = await getKey();
    const iv = new Uint8Array(b64ToBuf(payload.iv));
    const cipher = b64ToBuf(payload.data);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
    const text = new TextDecoder().decode(plain);
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
