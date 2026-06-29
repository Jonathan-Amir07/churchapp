import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const client = new Redis(redisUrl);

export type EventPayload = {
  type: string;
  id?: string;
  timestamp?: string;
  payload?: any;
};

export async function publishEvent(stream = 'events', event: EventPayload) {
  const id = await client.xadd(stream, '*', 'type', event.type, 'timestamp', event.timestamp ?? new Date().toISOString(), 'payload', JSON.stringify(event.payload ?? {}));
  return id;
}

export function getRedisClient() {
  return client;
}

export default { publishEvent, getRedisClient };
