import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, map, startWith, Subscription } from 'rxjs';
import { MessageTypeEnum } from 'src/app/models/enums/message-type.enum';
import { MessageI, MessagePaginateI, RoomI } from 'src/app/models/interfaces';
import { RoomService } from '../../services';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;

  @ViewChild('messages') private messagesScroller: ElementRef;

  private subscription: Subscription;
  paginatedMessages: MessagePaginateI;
  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private roomService: RoomService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const messagesSubscription =
      combineLatest([
        this.roomService.getMessages(),
        this.roomService.getAddedMessage().pipe(
          startWith(null)
        )
      ]).pipe(
        map(([messagePaginate, message]) => {
          // add new message to display when message exists and room matches the open room
          if (message && message.room.id === this.chatRoom.id && !messagePaginate.items.some(m => m.id === message.id)) {
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
    if (!this.chatRoom) {
      return;
    }
    this.roomService.openRoom(this.chatRoom);
  }

  ngOnDestroy(): void {
    if (!this.chatRoom) {
      return;
    }
    this.roomService.closeRoom(this.chatRoom);
    this.subscription.unsubscribe();
  }

  sendMessage(): void {
    const messageToSend: MessageI = {
      text: this.chatMessage.value,
      room: this.chatRoom,
      messageType: MessageTypeEnum.Normal
    };
    this.roomService.sendMessage(messageToSend);
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    if (!this.messagesScroller) {
      return;
    }
    this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight;
  }

}
