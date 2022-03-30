import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageI, MessagePaginateI, RoomI, RoomPaginateI } from 'src/app/models/interfaces';
import { ConstantsService, SnackBarService } from 'src/app/services';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: CustomSocket,
    private snackBarService: SnackBarService,
    private constantsService: ConstantsService
  ) { }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>(this.constantsService.SOCKET_FROM_MESSAGE_ADDED);
  }

  sendMessage(message: MessageI) {
    this.socket.emit(this.constantsService.SOCKET_TO_ADD_MESSAGE, message);
  }

  joinRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_JOIN_ROOM, room);
  }

  leaveRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_LEAVE_ROOM, room);
  }

  getMessages(): Observable<MessagePaginateI> {
    return this.socket.fromEvent<MessagePaginateI>(this.constantsService.SOCKET_FROM_MESSAGES);
  }

  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>(this.constantsService.SOCKET_FROM_ROOMS);
  }

  emitPaginateRooms(limit: number = 10, page: number = 0): void {
    const paginationOptions = { limit, page };
    this.socket.emit(this.constantsService.SOCKET_TO_PAGINATE_ROOMS, paginationOptions);
  }

  createRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_CREATE_ROOM, room);
    this.snackBarService.displayMatSnackBar(`Room ${room.name} created successfully`);
  }

}
