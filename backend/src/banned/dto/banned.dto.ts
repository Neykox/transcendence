import { IsNotEmpty, IsNumber } from "class-validator";

export class BannedDto {
    @IsNotEmpty()
    @IsNumber()
    channel: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    login: string;
}