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
    if (!socket || !room || !this.userExists(socket)) {
      return;
    }

    const creator: UserI = socket.data.user;
    const usersToAdd = await this.addedUserRoomService.addUsersToRoom(users, room, creator);
    room.users = usersToAdd;
    const createdRoom = await this.roomService.createRoom(room);

    // emit room to connected users added to room
    for (const addedUser of createdRoom.users) {
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

    if (!createdRoom.isPublic) {
      return;
    }

    const connectedUsers = await this.connectedUserService.getAll();
    for (const connectedUser of connectedUsers) {
      const paginatedRooms = await this.getAllPaginatedRooms(this.defaultPagination);
      await this.server.to(connectedUser.socketId).emit('allRooms', paginatedRooms);
    }
  }

  @SubscribeMessage('paginateMyRooms')
  async onPaginateMyRooms(socket: Socket, page: PageI): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    try {
      const paginationOptions = this.handleIncomingPageRequest(page);
      const user: UserI = socket.data.user;
      const paginatedRooms = await this.getMyPaginatedRooms(paginationOptions, user.id);
      this.server.to(socket.id).emit('rooms', paginatedRooms);
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('paginateAllRooms')
  async onPaginateAllRooms(socket: Socket, params: any): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    const page: PageI = params[0];
    const searchValue: string = params[1];

    try {
      const paginationOptions = this.handleIncomingPageRequest(page);
      const paginatedRooms = await this.getAllPaginatedRooms(paginationOptions, searchValue);
      this.server.to(socket.id).emit('allRooms', paginatedRooms);
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('filterAllRooms')
  async onFilterAllRooms(socket: Socket, searchValue: string): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    try {
      const paginatedRooms = await this.getAllPaginatedRooms(this.defaultPagination, searchValue);
      this.server.to(socket.id).emit('allRooms', paginatedRooms);
    } catch (error) {
      return;
    }
  }

  @SubscribeMessage('openRoom')
  async onOpenRoom(socket: Socket, room: RoomI): Promise<void> {
    if (!this.userExists(socket)) {
      return;
    }

    const paginatedMessages = await this.messageService.findMessagesForRoom(room.id, this.defaultPagination);
    // subtract page -1 to match angular material paginator
    paginatedMessages.meta.currentPage--;
    // save connection to room
    const connectedUserRoom: ConnectedUserRoomI = {
      socketId: socket.id,
      user: socket.data.user,
      room
    };
    await this.connectedUserRoomService.create(connectedUserRoom)
    //send most recent messages to user
    await this.server.to(socket.id).emit('messages', paginatedMessages);
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

  private async getAllPaginatedRooms(paginationOptions: IPaginationOptions, searchValue?: string): Promise<Pagination<RoomI>> {
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
