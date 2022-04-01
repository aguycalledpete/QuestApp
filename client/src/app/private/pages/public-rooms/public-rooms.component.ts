import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomPaginateI } from 'src/app/models/interfaces';
import { RoomService } from '../../services';

@Component({
  selector: 'app-public-rooms',
  templateUrl: './public-rooms.component.html',
  styleUrls: ['./public-rooms.component.scss']
})
export class PublicRoomsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  paginatedRooms: RoomPaginateI;

  constructor(
    private roomService: RoomService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const getMyRoomsSubscription = this.roomService.getMyRooms().subscribe(paginatedRooms => {
      this.paginatedRooms = paginatedRooms;
    });
    this.subscription.add(getMyRoomsSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  joinRoom(event: any): void {

  }

}
