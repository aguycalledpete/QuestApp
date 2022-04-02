import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { UserI } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { ConnectedUserRoomI } from '../models/connected-user-room/connected-user-room.interface';
import { MessageI } from '../models/message/message.interface';
import { PageI } from '../models/page/page.interface';
import { RoomI } from '../models/room/room.interface';
import { ConnectedUserService } from '../services/connected-user/connected-user.service';
import { ConnectedUserRoomService } from '../services/connected-user-room/connected-user-room.service';
import { MessageService } from '../services/message/message.service';
import { RoomService } from '../services/room/room.service';
import { AddedUserRoomService } from '../services/added-user-room/added-user-room.service';

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
  readonly defaultPagination = { page: 1, limit: 10 };

  @WebSocketServer()
  server: Server;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private connectedUserRoomService: ConnectedUserRoomService,
    private messageService: MessageService,
    private addedUserRoomService: AddedUserRoomService
  ) { }

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.connectedUserRoomService.deleteAll();
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.connectSocket(socket);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    // remove connection from db
    this.disconnectUser(socket);
    this.disconnectSocket(socket);
  }

  private async disconnectSocket(socket: Socket): Promise<void> {
    socket.disconnect();
  }

  private async disconnectUser(socket: Socket): Promise<void> {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.data.user = null;
  }

  private async connectSocket(socket: Socket): Promise<boolean> {
    let isLoginSuccessful = false;
    
    try {
      const decodedToken = await this.authenticationService.verifyJwt(
        socket.handshake.headers.authorization
      );
      const authorizedUser = await this.userService.findOneById(decodedToken.user.id);
      if (!authorizedUser) {
        this.disconnectSocket(socket);
        return;
      }

      socket.data.user = authorizedUser;

      // save connection to db
      await this.connectedUserService.create(socket.id, authorizedUser);

      isLoginSuccessful = true;
    } catch (error) {
      socket.emit('Error', new UnauthorizedException());
      this.disconnectSocket(socket);
    }

    await this.server.to(socket.id).emit('loginConfirmed', isLoginSuccessful);
  }

  @SubscribeMessage('login')
  async onLogin(socket: Socket) {
    this.connectSocket(socket);
  }

  @SubscribeMessage('logout')
  async onLogout(socket: Socket) {
    this.disconnectUser(socket);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI, users: UserI[] = []) {
    if (!socket || !room) {
      return;
    }

    const creator: UserI = socket.data.user;
    users.push(creator);
    room.creator = creator;

    const usersToAdd = await this.addedUserRoomService.addUsersToRoom(users, room);
    room.users = usersToAdd;
    const createdRoom = await this.roomService.createRoom(room);

    for (const addedUser of createdRoom.users) {
      const user = addedUser.user;
      const connections = await this.connectedUserService.findByUser(user);
      if (connections.length == 0) {
        continue;
      }
      const rooms = await this.roomService.getRoomsForUser(user.id, this.defaultPagination);
      // subtract page -1 to match angular material paginator
      rooms.meta.currentPage--;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    try {
      const paginationOptions = this.handleIncomingPageRequest(page);
      const user: UserI = socket.data.user;
      const rooms = await this.roomService.getRoomsForUser(user.id, paginationOptions);
      // subtract page -1 to match angular material paginator
      rooms.meta.currentPage--;
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('openRoom')
  async onOpenRoom(socket: Socket, room: RoomI) {
    const messages = await this.messageService.findMessagesForRoom(room.id, this.defaultPagination);
    // subtract page -1 to match angular material paginator
    messages.meta.currentPage--;
    // save connection to room
    const connectedUserRoom: ConnectedUserRoomI = {
      socketId: socket.id,
      user: socket.data.user,
      room
    };
    await this.connectedUserRoomService.create(connectedUserRoom)
    //send most recent messages to user
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('closeRoom')
  async onCloseRoom(socket: Socket) {
    // remove connection from connected user rooms
    await this.connectedUserRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const user: UserI = socket.data.user;
    message.user = user;
    const createdMessage = await this.messageService.create(message);
    const room = await this.roomService.getRoom(createdMessage.room.id);
    const connectedUserRooms = await this.connectedUserRoomService.findByRoom(room);
    // Send message to all connected users 
    for (const user of connectedUserRooms) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page++;
    return page;
  }
}
