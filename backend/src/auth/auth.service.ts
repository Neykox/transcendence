import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
	signin() {
		return { message: 'wassup' };
	}

	dc() {
		return { message: 'bye bye' };
	}
}
