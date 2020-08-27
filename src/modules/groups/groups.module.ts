import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../../entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupMembersModule } from './group-members/group-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity]), GroupMembersModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
