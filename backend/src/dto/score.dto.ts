import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class ScoreDto {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	opponent: string;

	@IsString()
	@IsNotEmpty()
	scores: string;

	@IsString()
	@IsNotEmpty()
	result: string;
}
