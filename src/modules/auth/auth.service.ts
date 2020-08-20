import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entities/user.entity';
import { UserAuthDTO } from './dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload = { email: user.email, sub: user.id, fullname: user.fullname };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async refreshToken (id: string) {
    const user = await this.usersService.findById(id);
    const payload = { email: user.email, sub: user.id, fullname: user.fullname };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  
  async signup(userDto: UserAuthDTO): Promise<any> {
    const newUser = await this.usersService.signup(userDto);
    const payload = { email: newUser.email, sub: newUser.id, fullname: newUser.fullname };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  
}
