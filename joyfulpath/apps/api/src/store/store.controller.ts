import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('rewards')
  getRewards() {
    return this.storeService.getRewards();
  }

  @Post('redeem/:id')
  redeemReward(@Request() req: any, @Param('id') id: string) {
    return this.storeService.redeemReward(id, req.user.id);
  }

  @Get('redemptions/pending')
  getPendingRedemptions(@Request() req: any) {
    return this.storeService.getPendingRedemptions(req.user.role);
  }

  @Patch('redemptions/:id/fulfill')
  fulfillRedemption(@Request() req: any, @Param('id') id: string) {
    return this.storeService.fulfillRedemption(id, req.user.id, req.user.role);
  }

  @Patch('redemptions/:id/reject')
  rejectRedemption(@Request() req: any, @Param('id') id: string) {
    return this.storeService.rejectRedemption(id, req.user.id, req.user.role);
  }

  @Post('rewards')
  createReward(@Request() req: any, @Body() body: any) {
    return this.storeService.createReward(body, req.user.id, req.user.role);
  }

  @Patch('rewards/:id')
  updateReward(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.storeService.updateReward(id, body, req.user.id, req.user.role);
  }

  @Patch('rewards/:id/deactivate')
  deactivateReward(@Request() req: any, @Param('id') id: string) {
    return this.storeService.deactivateReward(id, req.user.id, req.user.role);
  }
}
