import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: RegisterDto){

    const { email, username, password} = userDto;
    
    if (!email || !username || !password) {
        throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
    }
    
    return this.userService.create(userDto)    
    
  }
}
