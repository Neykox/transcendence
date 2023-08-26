import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class DuelDto {
	@IsString()
	@IsNotEmpty()
	challenger: string;

	@IsString()
	@IsNotEmpty()
	time: string;

	@IsString()
	@IsNotEmpty()
	gametype: string;

	@IsBoolean()
	answer?: boolean;
}
