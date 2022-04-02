import { Component, Input, OnInit } from '@angular/core';
import { UserRoleEnum } from 'src/app/models/enums';
import { RoomI, UserI } from 'src/app/models/interfaces';
import { UserService } from 'src/app/public/services';

@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss']
})
export class RoomListItemComponent implements OnInit {

  @Input() room: RoomI;

  creator: UserI;
  isUserAddedToRoom: boolean;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.setCreator();
    this.setIsUserAddedToRoom();
  }

  buttonClicked(): void {
    if (this.isUserAddedToRoom) {

    }

  }

  setCreator(): void {
    if (!this.room || !this.room.users || this.room.users.length == 0) {
      this.creator = {};
    }
    const creator = this.room?.users.find(user => user.role === UserRoleEnum.Creator);
    this.creator = creator.user;
  }

  setIsUserAddedToRoom(): void {
    if (!this.room || !this.room.users || this.room.users.length == 0) {
      this.creator = {};
    }
    const foundUser = this.room.users.find(addedUser =>
      addedUser.user.id == this.userService.loggedInUser.id
    );
    this.isUserAddedToRoom = foundUser != null;
  }

}
