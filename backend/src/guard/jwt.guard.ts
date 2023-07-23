import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>
  {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['my_cooky']

    if (!token) {
      throw new BadRequestException('yoken doesnt exist');
    }
    const payload = await this.jwtService.verifyAsync(token, {secret: 'secret'/*this.configService.get('JWT_SECRET')*/});

    if (!payload)
      throw new BadRequestException('token verification failled');


    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['user'] = payload;
	console.log('payload ', payload);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];//compris ce que ca fait mais rien compris a la syntax
    return type === 'Bearer' ? token : undefined;
  }
}
