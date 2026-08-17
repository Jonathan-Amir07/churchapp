import { Test, TestingModule } from '@nestjs/testing';
import { PriestsService } from './priests.service';

describe('PriestsService', () => {
  let service: PriestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriestsService],
    }).compile();

    service = module.get<PriestsService>(PriestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
