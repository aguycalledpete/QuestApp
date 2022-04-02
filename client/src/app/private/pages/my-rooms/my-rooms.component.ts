import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomPaginateI } from 'src/app/models/interfaces';
import { RoomService } from '../../services';

@Component({
  selector: 'app-my-rooms',
  templateUrl: './my-rooms.component.html',
  styleUrls: ['./my-rooms.component.scss']
})
export class MyRoomsComponent implements OnInit {

  private subscription: Subscription;
  paginatedRooms: RoomPaginateI;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const getMyRoomsSubscription =
      this.roomService.getMyRooms().subscribe(paginatedRooms => {
        this.paginatedRooms = paginatedRooms;
      });
    this.subscription.add(getMyRoomsSubscription);

    this.roomService.emitPaginateMyRooms();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.roomService.emitPaginateMyRooms();
  }

  goToCreateRooms(): void {
    this.router.navigate(['../create-room'], { relativeTo: this.activatedRoute });
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.roomService.emitPaginateMyRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}
