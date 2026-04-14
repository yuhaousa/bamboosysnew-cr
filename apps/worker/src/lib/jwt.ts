// ─── JWT HS256 using Web Crypto API (Cloudflare Workers built-in) ─────────────

export async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = toBase64Url(JSON.stringify(payload))
  const data = `${header}.${body}`

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${bufToBase64Url(sig)}`
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, payload, signature] = parts
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )

  const sigBytes = base64UrlToBuf(signature)
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(`${header}.${payload}`))
  if (!valid) return null

  try {
    const decoded = JSON.parse(fromBase64Url(payload)) as Record<string, unknown>
    if (decoded.exp && (decoded.exp as number) < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

// ─── Password hashing using PBKDF2 ───────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltHex = bufToHex(salt)
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  return `pbkdf2$${saltHex}$${bufToHex(new Uint8Array(bits))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false

  const salt = hexToBuf(parts[1])
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  return bufToHex(new Uint8Array(bits)) === parts[2]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toBase64Url(str: string): string {
  return btoa(unescape(encodeURIComponent(str))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function fromBase64Url(str: string): string {
  return decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))))
}

function bufToBase64Url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64UrlToBuf(str: string): Uint8Array {
  return Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
}

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
}

function hexToBuf(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
}
