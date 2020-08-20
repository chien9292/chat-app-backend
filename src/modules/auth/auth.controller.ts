import { Controller, Post, Request, UseGuards, Logger, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserAuthDTO } from './dtos/user.dto';
import { UsersService } from '../users/users.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signUp(@Body() userSignUpDto: UserAuthDTO): Promise<any> {
    const regExEmail = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    const isEmail = regExEmail.test(userSignUpDto.email);
    if (!isEmail)
      throw new HttpException('Email is invalid!', HttpStatus.BAD_REQUEST);

    const user = await this.usersService.findByEmail(userSignUpDto.email);
    if (user)
      throw new HttpException('This email is taken', HttpStatus.BAD_REQUEST);

    if (userSignUpDto.password != userSignUpDto.confirmPassword)
      throw new HttpException(
        'Passwords does not match!',
        HttpStatus.BAD_REQUEST,
      );
    return this.authService.signup(userSignUpDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  getNewToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
