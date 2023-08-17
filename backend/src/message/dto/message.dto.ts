import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    @IsNumber()
    creator: number;

    @IsNotEmpty()
    @IsNumber()
    channel: number;

    @IsString()
    content: string;
}