import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserAuthDTO } from '../auth/dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({where: { isActive: true }});
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email, isActive: true } });
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { id, isActive: true } });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(userDto: UserDTO): Promise<UserEntity> {
    const user = await this.usersRepository.create(userDto);
    await this.usersRepository.save(user);
    return user;
  }

  async update(id: string, data: Partial<UserDTO>) {
    data.id = id;
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return await this.usersRepository.findOne({ id });
  }

  async destroy(id: string): Promise<boolean> {
    await this.usersRepository.delete({ id });
    return true;
  }

  async signup(userDto: UserAuthDTO): Promise<UserEntity> {
    const user = await this.usersRepository.create(userDto);
    await this.usersRepository.save(user);
    return user;
  }
}
