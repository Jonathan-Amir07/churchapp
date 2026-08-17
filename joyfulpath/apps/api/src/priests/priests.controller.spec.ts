import { Test, TestingModule } from '@nestjs/testing';
import { PriestsController } from './priests.controller';

describe('PriestsController', () => {
  let controller: PriestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriestsController],
    }).compile();

    controller = module.get<PriestsController>(PriestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
