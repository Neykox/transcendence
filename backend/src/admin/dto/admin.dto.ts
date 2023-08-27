import { IsNotEmpty, IsNumber } from "class-validator";

export class AdminDto {
    @IsNotEmpty()
    @IsNumber()
    channel: number;

    @IsNotEmpty()
    @IsNumber()
    user: number;
}