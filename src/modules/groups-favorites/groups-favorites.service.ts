import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { GroupEntity } from 'src/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class GroupsFavoritesService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupsRepository: Repository<GroupEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(userId: string): Promise<GroupEntity[]> {
    const userDetails: UserEntity = await this.usersRepository.findOne({
      relations: ['favorites'],
      where: {
        id: userId,
      }
    });
    return userDetails?.favorites;
  }

  async addFavoriteGroup(userId: string, groupId: string): Promise<GroupEntity[]> {
    const user: UserEntity = await this.usersRepository.findOne({
      relations: ['favorites'],
      where: {
        id: userId,
      }
    });
    
    const duplicateGroup = user.favorites.find((group) => group.id === groupId);
    if(duplicateGroup) throw new HttpException('This group is already one of your favorites', HttpStatus.BAD_REQUEST);

    const group: GroupEntity = await this.groupsRepository.findOne({id: groupId});
    user.favorites.push(group);
    const updatedUser = await this.usersRepository.save(user);

    return updatedUser.favorites;
  }

  async deleteFavoriteGroup(userId: string, groupId: string): Promise<GroupEntity[]> {
    const user: UserEntity = await this.usersRepository.findOne({
      relations: ['favorites'],
      where: {
        id: userId,
      }
    });
    
    user.favorites = user.favorites.filter((group) => group.id !== groupId);
    const updatedUser = await this.usersRepository.save(user);

    return updatedUser.favorites;
  }
}
