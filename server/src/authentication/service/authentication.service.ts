import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/models/user.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  async generateJwt(user: UserI): Promise<string> {
    const result = await this.jwtService.signAsync({ user });
    return result;
  }

  async createHash(original: string): Promise<string> {
    const result: string = await bcrypt.hash(original, 12);
    return result;
  }

  async compareHash(original: string, hash: string): Promise<any> {
    const result = await bcrypt.compare(original, hash);
    return result;
  }

  async verifyJwt(jwt: string): Promise<any> {
    const result = await this.jwtService.verifyAsync(jwt);
    return result;
  }
}
