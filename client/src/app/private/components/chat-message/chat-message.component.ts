import { Component, Input } from '@angular/core';
import { MessageI, UserI } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/public/services';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;

  user: UserI = this.authenticationService.getLoggedInUser();

  constructor(
    private authenticationService: AuthenticationService
  ) { }

}
