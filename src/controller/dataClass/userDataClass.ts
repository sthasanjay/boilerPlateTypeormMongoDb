import { Type } from "class-transformer";
import "reflect-metadata";
import { IsDefined, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class UserCreate {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsUrl()
    @Type(() => String)
    avatar: string;
}
