import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return this.usersRepository.update(userId, {
      is2FaActive: true
    });
  }

  async turnOffTwoFa(userId: number) {
    // setTwoFaSecret(userId, NULL);
    return this.usersRepository.update(userId, {
      is2FaActive: false
    });
  }
}
