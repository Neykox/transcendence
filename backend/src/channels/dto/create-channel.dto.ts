import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { channelTypesDto } from "./channelTypes.dto";
import { Transform } from "class-transformer";

export class CreateChannelDto {
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    owner: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(channelTypesDto)
    type: channelTypesDto;

    @IsOptional()
    @IsString()    
    password?: string;
}
