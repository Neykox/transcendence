import { Injectable } from '@nestjs/common';

@Injectable({})
export class TwoFaService {
	enable_two_fa() {
		return { message: 'wassup' };
	}

	use_two_fa() {
		return { message: 'bye bye' };
	}
}
