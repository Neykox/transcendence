import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { channelTypesDto } from "./channelTypes.dto";
// import { Transform } from "class-transformer";

export class CreateChannelDto {
    @IsNotEmpty()
    @IsString()
    // @Transform(({ value }) => parseInt(value))
    owner: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(channelTypesDto)
    type: channelTypesDto;

    @IsOptional()
    @IsString()    
    password?: string;

    @IsOptional()
    @IsString()    
    dm?: string;
}
