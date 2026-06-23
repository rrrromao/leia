import { cookies } from 'next/headers'

const SESSION_COOKIE = 'leia_session'

async function importKey(raw: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', raw, 'PBKDF2', false, ['deriveBits']) as Promise<CryptoKey>
}

async function deriveBits(
  password: string,
  salt: ArrayBuffer,
): Promise<ArrayBuffer> {
  const enc = new TextEncoder().encode(password)
  const keyMaterial = await importKey(enc.buffer.slice(0))
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
}

export async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)).buffer.slice(0)
  const bits = await deriveBits(pw, salt)
  const out = new Uint8Array(salt.byteLength + bits.byteLength)
  out.set(new Uint8Array(salt), 0)
  out.set(new Uint8Array(bits), salt.byteLength)
  return Buffer.from(out).toString('base64')
}

export async function verifyPasswordAgainstHash(
  pw: string,
  stored: string,
): Promise<boolean> {
  try {
    const combined = new Uint8Array(Buffer.from(stored, 'base64'))
    const storedBits = combined.slice(16)
    const derivedBitsUint8 = new Uint8Array(
      await deriveBits(pw, combined.slice(0, 16).buffer.slice(0)),
    )
    if (derivedBitsUint8.length !== storedBits.length) return false
    let ok = 0
    for (let i = 0; i < derivedBitsUint8.length; i++) {
      ok |= derivedBitsUint8[i] ^ storedBits[i]
    }
    return ok === 0
  } catch {
    return false
  }
}

export async function verifyPassword(pw: string): Promise<boolean> {
  // Usa hash armazenado; fallback simplão para dev
  const stored = process.env.PASSWORD_HASH
  if (stored) return verifyPasswordAgainstHash(pw, stored)
  return pw === process.env.NEXT_PUBLIC_APP_PASSWORD
}

export function createSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function setSessionCookie(token: string) {
  const c = await cookies()
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSessionCookie() {
  const c = await cookies()
  c.delete(SESSION_COOKIE)
}

export async function getSessionToken(): Promise<string | undefined> {
  const c = await cookies()
  return c.get(SESSION_COOKIE)?.value
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken()
  return !!token && token.length === 64
}
