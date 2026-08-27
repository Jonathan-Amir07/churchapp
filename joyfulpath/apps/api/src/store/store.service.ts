import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getRewards() {
    return this.prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { costXp: 'asc' },
    });
  }

  async redeemReward(rewardId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
      });
      if (!reward || !reward.isActive) {
        throw new NotFoundException('Reward not available');
      }

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (user.totalPoints < reward.costPoints) {
        throw new BadRequestException('Not enough Points');
      }

      if (reward.inventoryCount !== null && reward.inventoryCount <= 0) {
        throw new BadRequestException('Out of stock');
      }

      // Deduct Points
      await tx.user.update({
        where: { id: userId },
        data: { totalPoints: { decrement: reward.costPoints } },
      });
      
      // Log point spending
      await tx.pointsTransaction.create({
        data: {
          userId,
          amount: -reward.costPoints,
          type: 'spent',
          source: 'store',
          sourceId: reward.id,
          description: `Purchased reward: ${reward.title}`,
        }
      });

      if (reward.inventoryCount !== null) {
        await tx.reward.update({
          where: { id: rewardId },
          data: { inventoryCount: { decrement: 1 } },
        });
      }

      // Create redemption
      return tx.rewardRedemption.create({
        data: {
          rewardId,
          userId: userId,
          status: 'pending', // pending fulfillment
        },
      });
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
        reviewedAt: new Date(),
        reviewedBy: userId,
      },
    });
  }

  async getPendingRedemptions(role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can view pending redemptions');
    }

    return this.prisma.rewardRedemption.findMany({
      where: { status: 'pending' },
      include: {
        user: { select: { firstName: true, lastName: true } },
        reward: { select: { title: true, type: true } },
      },
    });
  }

  async createReward(data: any, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can create rewards');
    }
    return this.prisma.reward.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        imageUrl: data.imageUrl,
        costXp: data.costXp, // Keeping for backward compatibility or display
        costPoints: data.costPoints || data.costXp, // Default to costXp if not provided
        inventoryCount: data.inventoryCount,
      },
    });
  }

  async updateReward(rewardId: string, data: any, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can update rewards');
    }
    return this.prisma.reward.update({
      where: { id: rewardId },
      data,
    });
  }

  async deactivateReward(rewardId: string, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can delete rewards');
    }
    // Soft delete / deactivate
    return this.prisma.reward.update({
      where: { id: rewardId },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async rejectRedemption(redemptionId: string, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can reject rewards');
    }

    // Must use a transaction to avoid double refunding
    return this.prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id: redemptionId },
        include: { reward: true },
      });

      if (!redemption) throw new NotFoundException('Redemption not found');
      if (redemption.status !== 'pending') {
        throw new BadRequestException('Request is no longer pending');
      }

      // Mark as rejected
      const updated = await tx.rewardRedemption.update({
        where: { id: redemptionId },
        data: {
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      });

      // Refund Points
      await tx.user.update({
        where: { id: redemption.userId },
        data: { totalPoints: { increment: redemption.reward.costPoints } },
      });
      
      // Log point refund
      await tx.pointsTransaction.create({
        data: {
          userId: redemption.userId,
          amount: redemption.reward.costPoints,
          type: 'refunded',
          source: 'store',
          sourceId: redemption.reward.id,
          description: `Refunded reward: ${redemption.reward.title}`,
        }
      });

      // Restore inventory
      if (redemption.reward.inventoryCount !== null) {
        await tx.reward.update({
          where: { id: redemption.reward.id },
          data: { inventoryCount: { increment: 1 } },
        });
      }

      return updated;
    });
  }
}
