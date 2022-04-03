import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, startWith, map } from 'rxjs';
import { MessageTypeEnum } from 'src/app/models/enums/message-type.enum';
import { MessageI, MessagePaginateI, RoomI } from 'src/app/models/interfaces';
import { ConstantsService, LocalStorageService, SnackBarService } from 'src/app/services';
import { RoomService } from '../../services';
import { CustomSocket } from '../../sockets/custom-socket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  @ViewChild('MessagesScroller') private messagesScroller: ElementRef;

  private subscription: Subscription;
  room: RoomI;
  paginatedMessages: MessagePaginateI;
  chatMessage: FormControl = new FormControl(null);

  constructor(
    private socket: CustomSocket,
    private constantsService: ConstantsService,
    private localStorageService: LocalStorageService,
    private roomService: RoomService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const queryParamsSubscription =
      this.route.queryParams.subscribe(params => {
        const roomId = params['id'];
        if (!roomId) {
          return;
        }
        this.socket.emit(this.constantsService.SOCKET_TO_OPEN_ROOM, roomId);
      });
    this.subscription.add(queryParamsSubscription);

    const roomOpenedSubscription =
      this.socket.fromEvent<RoomI>(this.constantsService.SOCKET_FROM_ROOM_OPENED)
        .subscribe(roomOpened => {
          this.room = roomOpened;
        });
    this.subscription.add(roomOpenedSubscription);

    const roomOpenErrorSubscription =
      this.socket.fromEvent<string>(this.constantsService.SOCKET_FROM_OPEN_ROOM_ERROR)
        .subscribe(roomOpenError => {
          this.snackBarService.displayMatSnackBar(roomOpenError, 5000);
        });
    this.subscription.add(roomOpenErrorSubscription);

    const messagesSubscription =
      combineLatest([
        this.roomService.getMessages(),
        this.roomService.getAddedMessage().pipe(
          startWith(null)
        )
      ]).pipe(
        map(([messagePaginate, message]) => {
          // add new message to display when message exists and room matches the open room
          if (message && message.room.id === this.room.id && !messagePaginate.items.some(m => m.id === message.id)) {
            messagePaginate.items.push(message);
          }
          // sorts messages to display latest messages at the bottom
          const items = messagePaginate.items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          messagePaginate.items = items;
          return messagePaginate;
        })
      ).subscribe((returnedPaginatedMessages) => {
        this.paginatedMessages = returnedPaginatedMessages;
        this.scrollToBottom()
      });
    this.subscription.add(messagesSubscription);
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.room) {
      return;
    }
    this.roomService.openRoom(this.room);
  }

  ngOnDestroy(): void {
    if (!this.room) {
      return;
    }
    this.roomService.closeRoom(this.room);
    this.subscription.unsubscribe();
  }

  sendMessage(): void {
    const messageToSend: MessageI = {
      text: this.chatMessage.value,
      room: this.room,
      messageType: MessageTypeEnum.Normal
    };
    this.roomService.sendMessage(messageToSend);
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    if (!this.messagesScroller) {
      return;
    }
    setTimeout(() => {
      this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight;
    }, 50);
  }

}
