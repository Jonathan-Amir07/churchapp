import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('StoreService', () => {
  let service: StoreService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation((cb) => cb(prisma)),
            reward: { findUnique: jest.fn(), update: jest.fn() },
            user: { findUnique: jest.fn(), update: jest.fn() },
            pointsTransaction: { create: jest.fn() },
            rewardRedemption: { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should redeem reward if user has enough points', async () => {
    (prisma.reward.findUnique as jest.Mock).mockResolvedValue({
      id: 'reward1',
      isActive: true,
      costPoints: 50,
      inventoryCount: 5,
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user1',
      totalPoints: 100,
    });

    await service.redeemReward('reward1', 'user1');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user1' },
      data: { totalPoints: { decrement: 50 } },
    });
    expect(prisma.reward.update).toHaveBeenCalledWith({
      where: { id: 'reward1' },
      data: { inventoryCount: { decrement: 1 } },
    });
    expect(prisma.rewardRedemption.create).toHaveBeenCalled();
  });

  it('should throw if not enough points', async () => {
    (prisma.reward.findUnique as jest.Mock).mockResolvedValue({
      id: 'reward1',
      isActive: true,
      costPoints: 150,
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user1',
      totalPoints: 100,
    });

    await expect(service.redeemReward('reward1', 'user1')).rejects.toThrow(BadRequestException);
  });

  it('should throw if out of stock', async () => {
    (prisma.reward.findUnique as jest.Mock).mockResolvedValue({
      id: 'reward1',
      isActive: true,
      costPoints: 50,
      inventoryCount: 0,
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user1',
      totalPoints: 100,
    });

    await expect(service.redeemReward('reward1', 'user1')).rejects.toThrow(BadRequestException);
  });
});
