import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}