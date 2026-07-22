import { getRedisClient } from './eventBus';
import prisma from '@/lib/db';

// Simple evaluator stub that can be wired to event stream consumers
export async function evaluateEvent(event: any) {
  try {
    // Example: when receiving XP_GAINED, check achievements with matching criteria
    if (event.type === 'XP_GAINED') {
      const { userId } = event.payload || {};
      // Fetch achievements and run lightweight checks (criteria in JSON)
      const achievements: any = await prisma.$queryRawUnsafe('SELECT * FROM achievements');
      for (const a of achievements) {
        // placeholder: real evaluator would parse a.criteria
        // If criteria satisfied, create StudentAchievement (use raw SQL or prisma after generating client)
      }
    }
  } catch (err) {
    console.error('Achievement evaluator error', err);
  }
}

export default { evaluateEvent };
