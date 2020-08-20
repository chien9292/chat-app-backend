import { Test, TestingModule } from '@nestjs/testing';
import { GroupsFavoritesController } from '../groups-favorites.controller';

describe('GroupsFavorites Controller', () => {
  let controller: GroupsFavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsFavoritesController],
    }).compile();

    controller = module.get<GroupsFavoritesController>(GroupsFavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
