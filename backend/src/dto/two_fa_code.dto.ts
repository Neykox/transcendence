import { IsNotEmpty, IsString } from "class-validator";

export class TwoFaCodeDto {
	@IsString()
	@IsNotEmpty()
	TwoFaCode: string
}
