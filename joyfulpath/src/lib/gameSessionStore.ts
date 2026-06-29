import { getRedisClient } from './eventBus';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const PREFIX = 'game:session:';

export async function createSession(gameType: string, hostUserId?: string, initialState: any = {}) {
  const id = uuidv4();
  const client = getRedisClient();
  await client.set(PREFIX + id, JSON.stringify({ gameType, state: initialState, hostUserId, createdAt: new Date().toISOString() }));
  // persist session record in DB
  await prisma.gameSession.create({ data: { id, gameType: gameType as any, hostUserId: hostUserId || null, state: initialState, startedAt: new Date() } });
  return id;
}

export async function getSessionState(id: string) {
  const client = getRedisClient();
  const v = await client.get(PREFIX + id);
  if (v) return JSON.parse(v);
  // fallback to DB
  const db = await prisma.gameSession.findUnique({ where: { id } });
  return db ? { gameType: db.gameType, state: db.state, hostUserId: db.hostUserId, createdAt: db.startedAt } : null;
}

export async function updateSessionState(id: string, patch: any) {
  const client = getRedisClient();
  const v = await client.get(PREFIX + id);
  let current = v ? JSON.parse(v) : { state: {} };
  current.state = { ...(current.state || {}), ...(patch || {}) };
  await client.set(PREFIX + id, JSON.stringify(current));
  return current;
}

export async function persistSessionToDb(id: string) {
  const state = await getSessionState(id);
  if (!state) return null;
  const updated = await prisma.gameSession.update({ where: { id }, data: { state: state.state, updatedAt: new Date() } as any });
  return updated;
}

export async function endSession(id: string) {
  const state = await getSessionState(id);
  await prisma.gameSession.update({ where: { id }, data: { status: 'completed', state: state?.state ?? {}, endedAt: new Date() } as any });
  // optionally remove Redis key
  const client = getRedisClient();
  await client.del(PREFIX + id);
}

export default { createSession, getSessionState, updateSessionState, persistSessionToDb, endSession };
