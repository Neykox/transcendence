import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PlayerMoveDto {

	@IsString()
	@IsNotEmpty()
	socketId: string;

	@IsNumber()
	@IsNotEmpty()
	dir: string;

	@IsNumber()
	@IsNotEmpty()
	room: string;
}