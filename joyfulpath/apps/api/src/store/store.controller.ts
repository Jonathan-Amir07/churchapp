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
  Res,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('store')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('rewards')
  getRewards() {
    return this.storeService.getRewards();
  }

  @Roles('student', 'admin', 'instructor', 'priest')
  @Post('redeem/:id')
  redeemReward(@Request() req: any, @Param('id') id: string) {
    // If instructor is doing it, they would need a studentId payload, but currently it's hardcoded to req.user.userId.
    // This implies only the logged-in user can redeem for themselves.
    return this.storeService.redeemReward(id, req.user.userId);
  }

  @Get('redemptions/pending')
  getPendingRedemptions(@Request() req: any) {
    return this.storeService.getPendingRedemptions(
      req.user.role,
      req.user.userId,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Get('redemptions/export')
  async exportRedemptions(@Request() req: any, @Res() res: any) {
    const csv = await this.storeService.exportRedemptions(
      req.user.role,
      req.user.userId,
    );
    res.header('Content-Type', 'text/csv');
    res.attachment('pending_redemptions.csv');
    return res.send(csv);
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch('redemptions/:id/fulfill')
  fulfillRedemption(@Request() req: any, @Param('id') id: string) {
    return this.storeService.fulfillRedemption(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch('redemptions/:id/reject')
  rejectRedemption(@Request() req: any, @Param('id') id: string) {
    return this.storeService.rejectRedemption(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Post('rewards')
  createReward(@Request() req: any, @Body() body: any) {
    return this.storeService.createReward(body, req.user.userId, req.user.role);
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch('rewards/:id')
  updateReward(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.storeService.updateReward(
      id,
      body,
      req.user.userId,
      req.user.role,
    );
  }

  @Roles('admin', 'instructor', 'priest')
  @Patch('rewards/:id/deactivate')
  deactivateReward(@Request() req: any, @Param('id') id: string) {
    return this.storeService.deactivateReward(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}
