import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async setTwoFaSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFaSecret: secret
    });
  }

  async turnOnTwoFa(userId: number) {
    this.usersRepository.update(userId, { is2FaActive: true });
    const user = await this.findOne(userId);
    const payload = { id: user.id, username: user.pseudo };
    console.log(payload);
    console.log({jwtSecret: await this.configService.get<string>('JWT_SECRET')})
    console.log({host: await this.configService.get<string>('POSTGRES_HOST')})
    const token = await this.jwtService.signAsync(payload, { secret: 'secret'/*await this.configService.get('JWT_SECRET')*/, expiresIn: '120s'})
    console.log(token);
    // return { access_token: await this.jwtService.signAsync(payload, { secret: 'secret'/*await this.configService.get('JWT_SECRET')*/, expiresIn: '60s'}) };
    this.usersRepository.update(userId, {token: token});
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=60s`;
    return {token}
  }

  async turnOffTwoFa(userId: number) {
    return this.usersRepository.update(userId, {
      is2FaActive: false,
      // twoFaSecret: null,
      // token: null
    });
  }

  async createUser()
  {}
}
