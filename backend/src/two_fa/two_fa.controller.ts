import { Controller, Post } from '@nestjs/common';
import { TwoFaService } from './two_fa.service';

@Controller('two_fa')
export class TwoFaController {
	constructor(private twoFaService: TwoFaService) {}

	@Post('enable_two_fa')
	enable_two_fa() {
		return this.twoFaService.enable_two_fa();
	}

	@Post('use_two_fa')
	use_two_fa() {
		return this.twoFaService.use_two_fa();
	}
}
