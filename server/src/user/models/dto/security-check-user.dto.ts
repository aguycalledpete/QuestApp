import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SecurityCheckUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    securityAnswer: string;
}