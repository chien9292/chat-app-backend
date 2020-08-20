import { Test, TestingModule } from '@nestjs/testing';
import { GroupsFavoritesService } from '../groups-favorites.service';

describe('GroupsFavoritesService', () => {
  let service: GroupsFavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsFavoritesService],
    }).compile();

    service = module.get<GroupsFavoritesService>(GroupsFavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
