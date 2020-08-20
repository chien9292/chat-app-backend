import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteGroupsService } from '../groups.favorite.service';

describe('FavoriteGroupsService', () => {
  let service: FavoriteGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteGroupsService],
    }).compile();

    service = module.get<FavoriteGroupsService>(FavoriteGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
