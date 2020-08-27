import { Module } from '@nestjs/common';
import { GroupsFavoritesController } from './groups-favorites.controller';
import { GroupsFavoritesService } from './groups-favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../../entities/group.entity';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GroupEntity])],
  controllers: [GroupsFavoritesController],
  providers: [GroupsFavoritesService]
})
export class GroupsFavoritesModule {}
