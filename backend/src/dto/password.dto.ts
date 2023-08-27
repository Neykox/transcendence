import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PasswordDto {

	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	password: string;
}