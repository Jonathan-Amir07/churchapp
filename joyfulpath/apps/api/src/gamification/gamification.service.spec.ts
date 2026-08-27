import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation((cb) => cb(prisma)),
            xpEntry: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
            user: { update: jest.fn(), findUnique: jest.fn() },
            pointsTransaction: { create: jest.fn() },
            level: { findMany: jest.fn() },
            notification: { create: jest.fn() },
            studentAchievement: { findUnique: jest.fn(), create: jest.fn() },
            achievement: { findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new xp entry if none exists', async () => {
    (prisma.xpEntry.findFirst as jest.Mock).mockResolvedValue(null);
    service.processStreak = jest.fn();
    service.checkAndAwardAchievements = jest.fn();

    await service.awardActivity('user1', 'quiz', 'q1', 100, 50);

    expect(prisma.xpEntry.create).toHaveBeenCalledWith({
      data: { userId: 'user1', source: 'quiz', sourceId: 'q1', xpAmount: 100 },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user1' },
      data: { totalXp: { increment: 100 }, totalPoints: { increment: 50 } },
    });
  });

  it('should only award difference if existing entry has lower XP', async () => {
    (prisma.xpEntry.findFirst as jest.Mock).mockResolvedValue({
      id: 'entry1',
      xpAmount: 60,
    });
    service.processStreak = jest.fn();
    service.checkAndAwardAchievements = jest.fn();

    await service.awardActivity('user1', 'quiz', 'q1', 100, 50);

    expect(prisma.xpEntry.update).toHaveBeenCalledWith({
      where: { id: 'entry1' },
      data: { xpAmount: 100 },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user1' },
      data: { totalXp: { increment: 40 }, totalPoints: { increment: 0 } },
    });
  });
});
