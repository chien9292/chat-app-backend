import { Module } from '@nestjs/common';
import { GroupMembersController } from './group-members.controller';
import { GroupMembersService } from './group-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from 'src/entities/group.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, UserEntity])],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
  exports: [GroupMembersService]
})
export class GroupMembersModule {}
