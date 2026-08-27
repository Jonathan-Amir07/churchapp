import { Module } from '@nestjs/common';
import { PriestsController } from './priests.controller';
import { PriestsService } from './priests.service';

@Module({
  controllers: [PriestsController],
  providers: [PriestsService],
})
export class PriestsModule {}
