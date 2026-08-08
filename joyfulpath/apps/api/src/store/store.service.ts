import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getRewards() {
    return this.prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { costPoints: 'asc' }
    });
  }

  async redeemReward(rewardId: string, userId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward || !reward.isActive) throw new NotFoundException('Reward not available');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.totalPoints < reward.costPoints) {
      throw new BadRequestException('Not enough points');
    }

    if (reward.quantityAvailable !== null && reward.quantityAvailable <= 0) {
      throw new BadRequestException('Out of stock');
    }

    // Deduct points
    await this.prisma.user.update({
      where: { id: userId },
      data: { totalPoints: { decrement: reward.costPoints } }
    });

    if (reward.quantityAvailable !== null) {
      await this.prisma.reward.update({
        where: { id: rewardId },
        data: { quantityAvailable: { decrement: 1 } }
      });
    }

    // Create redemption
    return this.prisma.rewardRedemption.create({
      data: {
        rewardId,
        studentId: userId,
        pointsSpent: reward.costPoints,
        status: 'pending' // pending fulfillment
      }
    });
  }

  async fulfillRedemption(redemptionId: string, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can fulfill rewards');
    }
    
    return this.prisma.rewardRedemption.update({
      where: { id: redemptionId },
      data: {
        status: 'fulfilled',
        fulfilledAt: new Date(),
        fulfilledBy: userId
      }
    });
  }

  async getPendingRedemptions() {
    return this.prisma.rewardRedemption.findMany({
      where: { status: 'pending' },
      include: {
        student: { select: { firstName: true, lastName: true } },
        reward: { select: { title: true, type: true } }
      }
    });
  }
}
