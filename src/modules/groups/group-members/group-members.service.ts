import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GroupEntity } from '../../../entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,
  ) {}

  async findMembers(groupId: string): Promise<UserEntity[]> {
    const group: GroupEntity = await this.groupsRepository.findOne({
      relations: ['members'],
      where: {
        id: groupId,
      },
      cache: true,
    });

    return group?.members;
  }
  
  async addMember(groupId: string, memberId: string): Promise<UserEntity[]> {
    const group: GroupEntity = await this.groupsRepository.findOne({
      relations: ['members'],
      where: {
        id: groupId,
      }
    });
    
    const duplicateUser = group.members.find((user) => user.id === memberId);
    if(duplicateUser) throw new HttpException('This member is already in the group', HttpStatus.BAD_REQUEST);

    const member: UserEntity = await this.usersRepository.findOne({id: memberId});
    group.members.push(member);
    const updatedGroup = await this.groupsRepository.save(group);

    return updatedGroup.members;
  }

  async deleteMemberFromGroup(groupId: string, memberId: string): Promise<UserEntity[]> {
    const group: GroupEntity = await this.groupsRepository.findOne({
      relations: ['members'],
      where: {
        id: groupId,
      }
    });
    
    if(group.creatorId === memberId) throw new HttpException('Group creator can NOT be removed from group', HttpStatus.BAD_REQUEST);
    
    group.members = group.members.filter((user) => user.id !== memberId);
    const updatedGroup = await this.groupsRepository.save(group);

    return updatedGroup.members;
  }
}
