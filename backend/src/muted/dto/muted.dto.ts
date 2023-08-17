import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class MutedDto {
    @IsNotEmpty()
    @IsNumber()
    channel: number;

    @IsNotEmpty()
    @IsNumber()
    user: number;

    @IsOptional()
    @IsDate()
    until: Date
}