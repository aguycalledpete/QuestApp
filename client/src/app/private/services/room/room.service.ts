import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageI, RoomI, RoomPaginateI } from 'src/app/models/interfaces';
import { SnackBarService, ConstantsService } from 'src/app/services';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  openedRoom: RoomI;

  constructor(
    private socket: CustomSocket,
    private snackBarService: SnackBarService,
    private constantsService: ConstantsService,
    private router: Router
  ) { }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>(this.constantsService.SOCKET_FROM_MESSAGE_ADDED);
  }

  sendMessage(message: MessageI) {
    this.socket.emit(this.constantsService.SOCKET_TO_ADD_MESSAGE, message);
  }

  openRoom(room: RoomI): void {
    this.router.navigate(['private/room'], { queryParams: { id: room.id } });
  }

  closeRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_CLOSE_ROOM, room);
    this.router.navigate(['private/public-rooms']);
  }

  async joinRoom(room: RoomI): Promise<void> {
    this.socket.emit(this.constantsService.SOCKET_TO_JOIN_ROOM, room.id);
    this.router.navigate(['private/room'], { queryParams: { id: room.id } });
  }

  leaveRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_LEAVE_ROOM, room.id);
    this.router.navigate(['private/public-rooms']);
  }

  getMessages(): Observable<MessageI[]> {
    return this.socket.fromEvent<MessageI[]>(this.constantsService.SOCKET_FROM_MESSAGES);
  }

  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>(this.constantsService.SOCKET_FROM_MY_ROOMS);
  }

  getPublicRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>(this.constantsService.SOCKET_FROM_ALL_ROOMS);
  }

  filterPublicRooms(searchValue: string): void {
    this.socket.emit(this.constantsService.SOCKET_TO_FILTER_ALL_ROOMS, searchValue);
  }

  emitPaginateMyRooms(limit: number = 10, page: number = 0): void {
    const paginationOptions = { limit, page };
    this.socket.emit(this.constantsService.SOCKET_TO_PAGINATE_MY_ROOMS, paginationOptions);
  }

  emitPaginatePublicRooms(limit: number = 10, page: number = 0, searchValue: string = null): void {
    const paginationOptions = { limit, page };
    this.socket.emit(this.constantsService.SOCKET_TO_PAGINATE_ALL_ROOMS, paginationOptions, searchValue);
  }

  createRoom(room: RoomI): void {
    this.socket.emit(this.constantsService.SOCKET_TO_CREATE_ROOM, room);
    this.snackBarService.displayMatSnackBar(`Room ${room.title} created successfully`);
  }
}
