import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { LoginResponseI } from '../models/login-response.interface';
import { UserI } from '../models/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';
import { SecurityCheckUserDto } from '../models/dto/security-check-user.dto';
import { ResetPasswordUserDto } from '../models/dto/reset-password-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) { }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<UserI> {
    const userEntity = this.userHelperService.userDtoToEntity(userDto);
    const createdUser = await this.userService.create(userEntity);
    return createdUser;
  }
  @Post('answer-question')
  async answerQuestion(@Body() securityCheckUserDto: SecurityCheckUserDto): Promise<boolean> {
    const userEntity = this.userHelperService.securityCheckUserDtoToEntity(securityCheckUserDto);
    const isValid = await this.userService.answerQuestion(userEntity);
    return isValid;
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordUserDto: ResetPasswordUserDto): Promise<boolean> {
    const userEntity = this.userHelperService.resetPasswordUserDtoToEntity(resetPasswordUserDto);
    const isValid = await this.userService.resetPassword(userEntity);
    return isValid;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    let loginResponse = {} as LoginResponseI;
    try {
      const userEntity = this.userHelperService.loginUserDtoToEntity(loginUserDto);
      const jwt = await this.userService.login(userEntity);
      loginResponse.accessToken = jwt;
      loginResponse.tokenType = 'jwt';
      loginResponse.expiresIn = 10000;
      loginResponse.isSuccessful = true;
    } catch (error) {
      loginResponse.isSuccessful = false;
    }
    return loginResponse;
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    const paginationOptions = {
      page,
      limit,
      route: 'http://localhost3000/server/user',
    };
    const allUsers = this.userService.findAll(paginationOptions);
    return allUsers;
  }

  @Get('/find-one-by-email')
  async findOneByEmail(@Query('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get('/find-by-username')
  async findAllByUsername(
    @Query('username') username: string,
    @Query('findOne') findOne: string,
  ) {
    if (findOne == 'true') {
      return this.userService.findOneByUsername(username);
    }
    return this.userService.findAllByUsername(username);
  }

}
