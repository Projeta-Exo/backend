import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}


  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list() {
    return this.userService.list()
  }

  @Post('register')
  async register(@Body() userDto: RegisterDto) {
    const { email, username, password } = userDto;

    if (!email || !username || !password) {
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      email,
      username,
      password: hashedPassword,
    });

    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
