import { Component, Input, OnInit } from '@angular/core';
import { MessageTypeEnum } from 'src/app/models/enums/message-type.enum';
import { MessageI, UserI } from 'src/app/models/interfaces';
import { UserService } from 'src/app/public/services';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: MessageI;

  user: UserI = this.userService.loggedInUser;
  text: string;
  messageType: MessageTypeEnum;
  sender: UserI;
  createdAt: Date;
  
  MessageTypeEnum = MessageTypeEnum;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.sender = this.message.user;
    this.text = this.message.text;
    this.messageType = this.message.messageType;
    this.createdAt = this.message.createdAt;
  }


}
