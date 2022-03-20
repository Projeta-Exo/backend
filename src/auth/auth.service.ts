import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };

    const token = this.jwtService.sign(payload);

    await this.tokenService.save(token, user.username);

    return {
      access_token: token,
    };
  }
}
