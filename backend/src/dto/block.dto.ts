import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BlockDto {

	@IsString()
	@IsNotEmpty()
	login: string;
}