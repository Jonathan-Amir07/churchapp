import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const isRedisEnabled = process.env.USE_REDIS === 'true';

// Lazy initialize client or keep it null
let client: Redis | null = null;

if (isRedisEnabled) {
  client = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) return null; // stop retrying
      return Math.min(times * 50, 2000);
    }
  });

  client.on('error', (err) => {
    console.warn('[Redis] Connection error:', err.message);
  });
}

export type EventPayload = {
  type: string;
  id?: string;
  timestamp?: string;
  payload?: any;
};

export async function publishEvent(stream = 'events', event: EventPayload) {
  if (!client) {
    console.log(`[EventBus Mock] Published to ${stream}:`, event.type);
    return 'mock-id-' + Date.now();
  }
  
  try {
    const id = await client.xadd(
      stream, 
      '*', 
      'type', event.type, 
      'timestamp', event.timestamp ?? new Date().toISOString(), 
      'payload', JSON.stringify(event.payload ?? {})
    );
    return id;
  } catch (error) {
    console.warn('[EventBus] Failed to publish event:', error);
    return null;
  }
}

export function getRedisClient() {
  return client;
}

export default { publishEvent, getRedisClient };
