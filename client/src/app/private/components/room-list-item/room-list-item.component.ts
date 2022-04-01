import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomI } from 'src/app/models/interfaces';

@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss']
})
export class RoomListItemComponent {

  @Input() room: RoomI = {};
  @Input() buttonText: string = 'Join';

  @Output() onButtonClick = new EventEmitter<any>();

  buttonClicked(event: any) {
    this.onButtonClick.emit(event);
  }

}
