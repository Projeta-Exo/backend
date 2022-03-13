import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  sanitilizeUser(user: User) {
    const sanitilized = user.toObject();
    delete sanitilized['password'];
    return sanitilized;
  }

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDto: RegisterDto) {
    const { email } = userDto;

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDto);

    await createdUser.save();

    return this.sanitilizeUser(createdUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username: username });
  }
}
