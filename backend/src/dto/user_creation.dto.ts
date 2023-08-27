import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserCreationDto {

	@IsString()
	@IsNotEmpty()
	Login: string;

	@IsString()
	@IsNotEmpty()
	Image: string;
}