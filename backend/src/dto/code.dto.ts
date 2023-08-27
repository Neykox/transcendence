import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CodeDto {
	@IsString()
	@IsNotEmpty()
	code: string;
}
