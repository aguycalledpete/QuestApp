import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserController } from './controller/user.controller';
import { FriendRequestEntity } from './models/friend-request/friend-request.entity';
import { UserEntity } from './models/user.entity';
import { UserHelperService } from './service/user-helper/user-helper.service';
import { UserService } from './service/user-service/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
    ]),
    AuthenticationModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserHelperService
  ],
  exports: [
    UserService
  ]
})
export class UserModule { }
