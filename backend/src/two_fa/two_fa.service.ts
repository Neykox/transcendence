import { Injectable } from '@nestjs/common';

@Injectable({})
export class TwoFaService {
	enable_two_fa() {
		return { message: 'enabled' };
	}

	disable_two_fa() {
		return { message: 'dissed' };
	}

	generate_two_fa() {
		return { message: 'qrcode generated' };
	}

	verify_two_fa() {
		return { message: 'qrcode verified' };
	}
}
