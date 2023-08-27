import { IsNotEmpty, IsString } from "class-validator";

export class ChangePseudoDto {
	@IsString()
	@IsNotEmpty()
	Pseudo: string;
}