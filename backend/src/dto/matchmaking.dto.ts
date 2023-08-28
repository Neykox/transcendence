import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class MatchmakingDto {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	pseudo: string;

	@IsString()
	@IsNotEmpty()
	color: string;

	@IsString()
	@IsNotEmpty()
	gametype: string;

	@IsString()
	room?: string;
}
