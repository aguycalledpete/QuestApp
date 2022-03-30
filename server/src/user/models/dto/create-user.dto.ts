import { IsNotEmpty, IsString } from "class-validator";
import { LoginUserDto } from "./login-user.dto";


export class CreateUserDto extends LoginUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    securityQuestion: string;

    @IsString()
    @IsNotEmpty()
    securityAnswer: string;

}