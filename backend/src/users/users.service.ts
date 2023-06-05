import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
	@InjectRepository(User)
	private usersRepository: Repository<User>,
	private authService: AuthService
  ) {}

  async findAll(): Promise<User[]> {
	return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
	return this.usersRepository.findOneBy({ id });
  }

  async findOneByLogin(login: string): Promise<User> {
	return this.usersRepository.findOneBy({ login });
  }


  async setTwoFaSecret(secret: string, userId: number) {
	return this.usersRepository.update(userId, {
	  twoFaSecret: secret
	});
  }

  async turnOnTwoFa(user: User) {
	this.usersRepository.update(user.id, { is2FaActive: true });
	// console.log({jwtSecret: await this.configService.get<string>('JWT_SECRET')})
	// console.log({host: await this.configService.get<string>('POSTGRES_HOST')})
	const token = await this.authService.create_cookie(user);
	return token
  }

  async turnOffTwoFa(user: User) {
	this.usersRepository.update(user.id, {
	  is2FaActive: false,
	  twoFaSecret: null,
	});
  }

  async create(user: Partial<User>): Promise<User>
  {
	const newuser = this.usersRepository.create(user);
	return this.usersRepository.save(newuser);
  }
}
