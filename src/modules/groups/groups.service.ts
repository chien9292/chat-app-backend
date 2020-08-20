import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from 'src/entities/group.entity';
import { Repository, DeleteResult, Like } from 'typeorm';
import { GroupDTO } from './group.dto';
import { ILike } from 'src/helpers/ilike.operator';
import { GroupMembersService } from './group-members/group-members.service';
import { GroupTypes } from 'src/constants/constant';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  async findAll(creatorId: string, name: string): Promise<GroupEntity[]> {
    return this.groupsRepository.find({
      where: name ? {
        name: ILike(`%${name}%`)
      } : {},
      cache: true,
      take: name ? 5 : null
    });
  }
  async findById(id: string): Promise<GroupEntity> {
    return await this.groupsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.groupsRepository.delete(id);
  }

  async create(creatorId: string, groupDto: GroupDTO): Promise<GroupEntity> {
    try {
      const group = await this.groupsRepository.create({
        creatorId,
        ...groupDto,
      });
      await this.groupsRepository.save(group);

      await this.groupMembersService.addMember(group.id, creatorId);
      return group;
    } catch (error) {
      const message: String = error.message;
      if (message && message.includes('unique')) {
        throw new HttpException(
          'This group name is taken!',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Bad server!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createOneToOne(creatorId: string, groupDto: GroupDTO): Promise<GroupEntity> {
    groupDto.type = GroupTypes.OneToOne;
    try {
      const group = await this.groupsRepository.create({
        creatorId,
        ...groupDto,
      });
      await this.groupsRepository.save(group);

      await this.groupMembersService.addMember(group.id, creatorId);
      return group;
    } catch (error) {
      const message: String = error.message;
      if (message && message.includes('unique')) {
        throw new HttpException(
          'This group name is taken!',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Bad server!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, data: Partial<GroupDTO>) {
    await this.groupsRepository.update({ id }, data);
    return await this.groupsRepository.findOne({ id });
  }

  async destroy(creatorId: string, id: string): Promise<DeleteResult> {
    return await this.groupsRepository.delete({ creatorId, id });
  }
}
