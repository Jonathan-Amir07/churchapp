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
    const rewards = await this.prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { costPoints: 'asc' }, // Order by costPoints now, costXp was removed or old
    });

    return rewards.map((r) => {
      let meta: any = {};
      try {
        if (r.metadata) meta = JSON.parse(r.metadata);
      } catch (e) {}

      return {
        ...r,
        pointsCost: r.costPoints,
        stock: r.inventoryCount,
        titleAr: meta.titleAr,
        descriptionAr: meta.descriptionAr,
        icon: meta.icon,
      };
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
        },
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

    const redemption = await this.prisma.rewardRedemption.findUnique({
      where: { id: redemptionId },
    });
    if (!redemption) throw new NotFoundException('Redemption not found');

    if (role === 'instructor') {
      await this.verifyInstructorStudentAccess(redemption.userId, userId);
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

  async getPendingRedemptions(role: string, userId: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException(
        'Only instructors can view pending redemptions',
      );
    }

    const where: any = { status: 'pending' };

    if (role === 'instructor') {
      const classes = await this.prisma.class.findMany({
        where: {
          OR: [
            { createdBy: userId },
            { members: { some: { userId, role: 'instructor' } } },
          ],
        },
      });
      const classIds = classes.map((c) => c.id);
      where.user = { classMembers: { some: { classId: { in: classIds } } } };
    }

    const redemptions = await this.prisma.rewardRedemption.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        reward: {
          select: { title: true, type: true, costPoints: true, metadata: true },
        },
      },
    });

    return redemptions.map((r) => {
      let meta: any = {};
      try {
        if (r.reward.metadata) meta = JSON.parse(r.reward.metadata);
      } catch (e) {}

      return {
        id: r.id,
        rewardId: r.rewardId,
        userId: r.userId,
        status: r.status,
        createdAt: r.requestedAt.toISOString(),
        studentName: `${r.user.firstName} ${r.user.lastName}`,
        itemTitle: r.reward.title,
        itemTitleAr: meta.titleAr,
        pointsCost: r.reward.costPoints,
      };
    });
  }

  async exportRedemptions(role: string, userId: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can export redemptions');
    }

    const where: any = { status: 'pending' };

    if (role === 'instructor') {
      const classes = await this.prisma.class.findMany({
        where: {
          OR: [
            { createdBy: userId },
            { members: { some: { userId, role: 'instructor' } } },
          ],
        },
      });
      const classIds = classes.map((c) => c.id);
      where.user = { classMembers: { some: { classId: { in: classIds } } } };
    }

    const redemptions = await this.prisma.rewardRedemption.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        reward: { select: { title: true, type: true } },
      },
    });

    let csv = 'id,rewardId,userId,studentName,rewardTitle,status,requestedAt\n';
    for (const r of redemptions) {
      csv += `${r.id},${r.rewardId},${r.userId},"${r.user.firstName} ${r.user.lastName}","${r.reward.title}",${r.status},${r.requestedAt.toISOString()}\n`;
    }
    return csv;
  }

  private async verifyInstructorStudentAccess(
    studentId: string,
    instructorId: string,
  ) {
    const classes = await this.prisma.class.findMany({
      where: {
        OR: [
          { createdBy: instructorId },
          { members: { some: { userId: instructorId, role: 'instructor' } } },
        ],
      },
    });
    const classIds = classes.map((c) => c.id);
    const isMember = await this.prisma.classMember.findFirst({
      where: { userId: studentId, classId: { in: classIds } },
    });
    if (!isMember) {
      throw new ForbiddenException('Not authorized to manage this student');
    }
  }

  async createReward(data: any, userId: string, role: string) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can create rewards');
    }

    const meta = {
      titleAr: data.titleAr,
      descriptionAr: data.descriptionAr,
      icon: data.icon,
    };

    return this.prisma.reward.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        imageUrl: data.imageUrl,
        costXp: data.costPoints || data.pointsCost || 0,
        costPoints: data.costPoints || data.pointsCost || 0,
        inventoryCount:
          data.inventoryCount !== undefined ? data.inventoryCount : data.stock,
        metadata: JSON.stringify(meta),
      },
    });
  }

  async updateReward(
    rewardId: string,
    data: any,
    userId: string,
    role: string,
  ) {
    if (role !== 'instructor' && role !== 'admin') {
      throw new ForbiddenException('Only instructors can update rewards');
    }

    const meta = {
      titleAr: data.titleAr,
      descriptionAr: data.descriptionAr,
      icon: data.icon,
    };

    const updateData: any = {
      title: data.title,
      description: data.description,
      type: data.type,
      imageUrl: data.imageUrl,
      costXp: data.costPoints || data.pointsCost || 0,
      costPoints: data.costPoints || data.pointsCost || 0,
      inventoryCount:
        data.inventoryCount !== undefined ? data.inventoryCount : data.stock,
      metadata: JSON.stringify(meta),
    };

    return this.prisma.reward.update({
      where: { id: rewardId },
      data: updateData,
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

      if (role === 'instructor') {
        const classes = await tx.class.findMany({
          where: {
            OR: [
              { createdBy: userId },
              { members: { some: { userId, role: 'instructor' } } },
            ],
          },
        });
        const classIds = classes.map((c) => c.id);
        const isMember = await tx.classMember.findFirst({
          where: { userId: redemption.userId, classId: { in: classIds } },
        });
        if (!isMember) {
          throw new ForbiddenException('Not authorized to manage this student');
        }
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
        },
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
