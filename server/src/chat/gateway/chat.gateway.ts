import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
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
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { MessageTypeEnum } from '../models/message/message-type.enum';

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

  @SubscribeMessage('login')
  async onLogin(socket: Socket): Promise<void> {
    this.connectSocket(socket);
  }

  @SubscribeMessage('logout')
  async onLogout(socket: Socket): Promise<void> {
    this.disconnectUser(socket);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI, users: UserI[] = []): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    // save room
    const createdRoom = await this.roomService.createRoom(room);

    // save and add users to room
    const creator: UserI = socket.data.user;
    const addedUsers = await this.addedUserRoomService.addUsersToRoom(users, room, creator);

    // save notification message
    const message: MessageI = {
      text: `${creator.username} created this room!`,
      messageType: MessageTypeEnum.Notification,
      user: creator,
      room: createdRoom
    }
    const createdMessage = await this.messageService.create(message);

    // send new room to added and currently connected users
    for (const addedUser of addedUsers) {
      const user = addedUser.user;
      const connections = await this.connectedUserService.findByUser(user);
      if (connections.length == 0) {
        continue;
      }

      const paginatedRooms = await this.getMyPaginatedRooms(this.defaultPagination, user.id);
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', paginatedRooms);
      }
    }

    // if created room is public, send new room to all connected users
    if (!createdRoom.isPublic) {
      return;
    }
    const connectedUsers = await this.connectedUserService.getAll();
    for (const connectedUser of connectedUsers) {
      const publicPaginatedRooms = await this.getPublicPaginatedRooms(this.defaultPagination);
      await this.server.to(connectedUser.socketId).emit('publicRooms', publicPaginatedRooms);
    }
  }

  @SubscribeMessage('paginateMyRooms')
  async onPaginateMyRooms(socket: Socket, page: PageI): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    const paginationOptions = this.handleIncomingPageRequest(page);
    const user: UserI = socket.data.user;
    const paginatedRooms = await this.getMyPaginatedRooms(paginationOptions, user.id);
    this.server.to(socket.id).emit('rooms', paginatedRooms);
  }

  @SubscribeMessage('paginatePublicRooms')
  async onPaginatePublicRooms(socket: Socket, params: any): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    const page: PageI = params[0];
    const searchValue: string = params[1];

    const paginationOptions = this.handleIncomingPageRequest(page);
    const paginatedRooms = await this.getPublicPaginatedRooms(paginationOptions, searchValue);
    this.server.to(socket.id).emit('publicRooms', paginatedRooms);
  }

  @SubscribeMessage('filterPublicRooms')
  async onFilterPublicRooms(socket: Socket, searchValue: string): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    try {
      const paginatedRooms = await this.getPublicPaginatedRooms(this.defaultPagination, searchValue);
      this.server.to(socket.id).emit('publicRooms', paginatedRooms);
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('openRoom')
  async onOpenRoom(socket: Socket, roomId: number): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    const room = await this.roomService.getRoomById(roomId);
    const user: UserI = socket.data.user;
    const isUserAddedRoom = await this.addedUserRoomService.isUserIdAddedToRoom(room.id, user.id);
    if (!isUserAddedRoom) {
      await this.server.to(socket.id).emit('openRoomError', 'User not added to room');
      return;
    }
    await this.server.to(socket.id).emit('roomOpened', room);

    // save connection to room
    const connectedUserRoom: ConnectedUserRoomI = {
      socketId: socket.id,
      user, room
    };
    await this.connectedUserRoomService.create(connectedUserRoom)

    // send most recent messages to user
    const messages = await this.messageService.findMessagesForRoom(room.id);
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, roomId: number): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    // add user to room
    const room = await this.roomService.getRoomById(roomId);
    const user: UserI = socket.data.user;
    const addedUsers = await this.addedUserRoomService.addUsersToRoom([user], room);

    // save notification message
    const message: MessageI = {
      text: `${user.username} has joined!`,
      messageType: MessageTypeEnum.Notification,
      user, room
    }
    const createdMessage = await this.messageService.create(message);

    // send message to connected users in the room
    const connectedUserRooms = await this.connectedUserRoomService.findByRoom(room);
    for (const user of connectedUserRooms) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  @SubscribeMessage('closeRoom')
  async onCloseRoom(socket: Socket): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    // remove connection from connected user rooms
    await this.connectedUserRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    // save message
    const user: UserI = socket.data.user;
    message.user = user;
    const createdMessage = await this.messageService.create(message);


    // send message to connected users in the room
    const room = await this.roomService.getRoomById(createdMessage.room.id);
    const connectedUserRooms = await this.connectedUserRoomService.findByRoom(room);
    for (const user of connectedUserRooms) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private userExists(socket: Socket): boolean {
    return socket.data.user != null;
  }

  private async disconnectSocket(socket: Socket): Promise<void> {
    socket.disconnect();
  }

  private async disconnectUser(socket: Socket): Promise<void> {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.data.user = null;
    socket.emit('userDisconnected', new UnauthorizedException());
  }

  private async connectSocket(socket: Socket): Promise<void> {
    let isLoginSuccessful = false;

    try {
      const decodedToken = await this.authenticationService.verifyJwt(
        socket.handshake.headers.authorization
      );
      const authorizedUser = await this.userService.findOneById(decodedToken.user.id);
      if (!authorizedUser) {
        this.disconnectUser(socket);
        return;
      }

      socket.data.user = authorizedUser;

      // save connection to db
      await this.connectedUserService.create(socket.id, authorizedUser);

      isLoginSuccessful = true;
    } catch (error) {
      this.disconnectUser(socket);
    }

    await this.server.to(socket.id).emit('loginConfirmed', isLoginSuccessful);
  }

  private handleIncomingPageRequest(page: PageI): PageI {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page++;
    return page;
  }

  private async getMyPaginatedRooms(paginationOptions: IPaginationOptions, userId?: number): Promise<Pagination<RoomI>> {
    let paginatedRooms: Pagination<RoomI>;
    paginatedRooms = await this.roomService.getRoomsForUser(userId, paginationOptions);
    paginatedRooms = await this.updatePaginatedRooms(paginatedRooms);
    return paginatedRooms;
  }

  private async getPublicPaginatedRooms(paginationOptions: IPaginationOptions, searchValue?: string): Promise<Pagination<RoomI>> {
    let paginatedRooms: Pagination<RoomI>;
    try {
      if (searchValue) {
        paginatedRooms = await this.roomService.getFilteredPublicRooms(paginationOptions, searchValue);
      } else {
        paginatedRooms = await this.roomService.getPublicRooms(paginationOptions);
      }
    } catch (error) {
      const e = error;
    }
    paginatedRooms = await this.updatePaginatedRooms(paginatedRooms);

    return paginatedRooms;
  }

  private async updatePaginatedRooms(paginatedRooms: Pagination<RoomI>): Promise<Pagination<RoomI>> {
    // subtract page -1 to match angular material paginator
    paginatedRooms.meta.currentPage--;

    //get room details
    for (let room of paginatedRooms.items) {
      const users = await this.addedUserRoomService.findAddedUserByRoom(room.id);
      room.users = users;
    }

    return paginatedRooms;
  }

}
