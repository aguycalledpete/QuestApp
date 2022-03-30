import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/models/dto/create-user.dto';
import { LoginUserDto } from 'src/user/models/dto/login-user.dto';
import { UserI } from 'src/user/models/user.interface';
import { SecurityCheckUserDto } from 'src/user/models/dto/security-check-user.dto';
import { ResetPasswordUserDto } from 'src/user/models/dto/reset-password-user.dto';

@Injectable()
export class UserHelperService {

    userDtoToEntity(userDto: CreateUserDto): UserI {
        const user: UserI = {
            email: userDto.email,
            username: userDto.username,
            password: userDto.password,
            securityQuestion: userDto.securityQuestion,
            securityAnswer: userDto.securityAnswer
        };
        return user;
    }

    loginUserDtoToEntity(loginUserDto: LoginUserDto): UserI {
        const user: UserI = {
            email: loginUserDto.email,
            password: loginUserDto.password
        };
        return user;
    }

    securityCheckUserDtoToEntity(securityCheckUserDto: SecurityCheckUserDto): UserI {
        const user: UserI = {
            email: securityCheckUserDto.email,
            securityAnswer: securityCheckUserDto.securityAnswer
        };
        return user;
    }

    resetPasswordUserDtoToEntity(resetPasswordUserDto: ResetPasswordUserDto): UserI {
        const user: UserI = {
            email: resetPasswordUserDto.email,
            password: resetPasswordUserDto.password
        };
        return user;
    }

}
