import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { UserI } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { ConnectedUserI } from '../models/connected-user/connected-user.interface';
import { JoinedRoomI } from '../models/joined-room/joined-room.interface';
import { MessageI } from '../models/message/message.interface';
import { PageI } from '../models/page/page.interface';
import { RoomI } from '../models/room/room.interface';
import { ConnectedUserService } from '../services/connected-user/connected-user.service';
import { JoinedRoomService } from '../services/joined-room/joined-room.service';
import { MessageService } from '../services/message/message.service';
import { RoomService } from '../services/room/room.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200'
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private messageService: MessageService
  ) { }

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authenticationService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.findOneById(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      }

      socket.data.user = user;
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      // subtract page -1 to match angular material paginator
      rooms.meta.currentPage--;

      // save connection to db
      await this.connectedUserService.create({ socketId: socket.id, user });

      //emits rooms to specific connected client
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    // remove connection from db
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const createdRoom: RoomI = await this.roomService.createRoom(room, socket.data.user);

    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, { page: 1, limit: 10 });
      // subtract page -1 to match angular material paginator
      rooms.meta.currentPage--;

      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    const paginationOptions: PageI = this.handleIncomingPageRequest(page);
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      paginationOptions,
    );
    // subtract page -1 to match angular material paginator
    rooms.meta.currentPage--;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
    // subtract page -1 to match angular material paginator
    messages.meta.currentPage--;
    // save connection to room
    await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room })
    //send most recent messages to user
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from joined rooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const createdMessage: MessageI = await this.messageService.create({ ...message, user: socket.data.user });
    const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
    const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
    // Send message to all joined users 
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
