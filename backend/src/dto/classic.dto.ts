import { IsNotEmpty, IsString, IsNumber, ValidateNested } from "class-validator";

export class ClassicDto {
	@IsNumber()
	channelId: number;

	@IsNumber()
	userId?: number;

	@IsString()
	userLogin?: string;

	@IsNumber()
	targetId?: number;

	@IsString()
	targetLogin?: string;
}
