import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Token } from '../types/token';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token')
    private tokenModel: Model<Token>,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async save(hash: string, username: string) {
    const objToken = await this.tokenModel.findOne({ username: username });

    if (objToken) {
      await this.tokenModel.findByIdAndUpdate(objToken.id, {
        hash: hash,
      });
    } else {
      this.tokenModel.insertMany({
        hash: hash,
        username: username,
      });
    }
  }

  async refreshToken(oldToken: string) {
    const objToken = await this.tokenModel.findOne({ hash: oldToken });

    if (objToken) {
      const user = await this.userService.findOne(objToken.username);
      return this.authService.login(user);
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
