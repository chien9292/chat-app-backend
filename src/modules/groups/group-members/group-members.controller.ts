import { Controller, UseGuards, Get, Request, Param, Post, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { GroupMembersService } from './group-members.service';

@Controller()
export class GroupMembersController {
  constructor(
    private readonly groupMembersService: GroupMembersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMembers(@Param('groupId') groupId: string) {
    return this.groupMembersService.findMembers(groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':memberId')
  addMember(@Param('groupId') groupId: string, @Param('memberId') memberId: string) {
    return this.groupMembersService.addMember(groupId, memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':memberId')
  deleteMemberFromGroup(@Param('groupId') groupId: string, @Param('memberId') memberId: string) {
    return this.groupMembersService.deleteMemberFromGroup(groupId, memberId);
  }
}
