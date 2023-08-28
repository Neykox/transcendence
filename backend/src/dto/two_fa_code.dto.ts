import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class TwoFaCodeDto {
	@IsString()
	@IsNotEmpty()
	TwoFaCode: string

	@IsNumber()
	@IsNotEmpty()
	Id: number
}
