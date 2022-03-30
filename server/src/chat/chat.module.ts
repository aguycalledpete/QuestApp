import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomEntity } from './models/room/room.entity';
import { RoomService } from './services/room/room.service';
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import { MessageEntity } from './models/message/message.entity';
import { ConnectedUserRoomEntity } from './models/connected-user-room/connected-user-room.entity';
import { ConnectedUserRoomService } from './services/connected-user-room/connected-user-room.service';
import { ConnectedUserEntity } from './models/connected-user/connected-user.entity';
import { MessageService } from './services/message/message.service';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      MessageEntity,
      ConnectedUserRoomEntity,
    ])
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService, ConnectedUserRoomService, MessageService]
})
export class ChatModule { }
