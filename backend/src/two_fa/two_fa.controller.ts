import { Controller, Post } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';

@Controller('two_fa')
export class TwoFaController {
	constructor(private twoFaService: TwoFaService) {}

	@Post('enable_two_fa')
	enable_two_fa() {
		return this.twoFaService.enable_two_fa();
	}

	@Post('disable_two_fa')
	disable_two_fa() {
		return this.twoFaService.disable_two_fa();
	}

	@Post('generate_two_fa')
	generate_two_fa() {
		return this.twoFaService.generate_two_fa();
	}

	@Post('verify_two_fa')
	verify_two_fa() {
		return this.twoFaService.verify_two_fa();
	}
}
