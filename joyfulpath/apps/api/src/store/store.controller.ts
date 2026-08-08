import { Controller, Get, Post, Patch, Param, Request, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('rewards')
  getRewards() {
    return this.storeService.getRewards();
  }

  @Post('redeem/:id')
  redeemReward(@Request() req, @Param('id') id: string) {
    return this.storeService.redeemReward(id, req.user.id);
  }

  @Get('redemptions/pending')
  getPendingRedemptions() {
    return this.storeService.getPendingRedemptions();
  }

  @Patch('redemptions/:id/fulfill')
  fulfillRedemption(@Request() req, @Param('id') id: string) {
    return this.storeService.fulfillRedemption(id, req.user.id, req.user.role);
  }
}
