import { v4 as uuid } from 'uuid'
import type { Env } from '../index'

export async function logAudit(
  db: D1Database,
  userId: string,
  userName: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata: Record<string, unknown> = {}
) {
  await db.prepare(
    `INSERT INTO audit_logs (id, user_id, user_name, action, resource_type, resource_id, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    uuid(),
    userId,
    userName,
    action,
    resourceType,
    resourceId,
    JSON.stringify(metadata)
  ).run()
}

export function now() {
  return new Date().toISOString()
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}
