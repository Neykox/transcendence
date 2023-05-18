// import { Injectable } from '@nestjs/common';

// @Injectable({})
// export class TwoFaService {
// 	enable_two_fa() {
// 		return { message: 'enabled' };
// 	}

// 	disable_two_fa() {
// 		return { message: 'dissed' };
// 	}

// 	generate_two_fa() {
// 		return { message: 'qrcode generated' };
// 	}

// 	verify_two_fa() {
// 		return { message: 'qrcode verified' };
// 	}
// }



import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

import { toFileStream } from 'qrcode';
import { Response } from 'express';
 
@Injectable()
export class TwoFaService {
  constructor (
    private readonly usersService: UsersService,
  ) {}
 
  public async generate_2Fa_Secret(user: User) {
    const secret = authenticator.generateSecret();
    const appName = "ft_graduate"
 
    const otpauthUrl = authenticator.keyuri(user.pseudo, appName, secret);
 
    await this.usersService.setTwoFaSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFaSecret
  })
 }

}