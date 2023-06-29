import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, response } from 'express';
import { ConfigService } from '@nestjs/config'
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Http2ServerResponse } from 'http2';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>
  {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['my_cooky']

    if (!token) {
		request['error'] = 401;
		return true;
    }
	try {
		const payload = await this.jwtService.verifyAsync(token, {secret: 'secret'/*this.configService.get('JWT_SECRET')*/});
		if (!payload) 
			throw new UnauthorizedException('token verification failed');
		request['user'] = payload;
		return true;
	} catch (e) {
		request['error'] = 401;
		return true;
	}


    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];//compris ce que ca fait mais rien compris a la syntax
    return type === 'Bearer' ? token : undefined;
  }
}
