import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, iif, skipWhile, Subscription, switchMap, tap, throttleTime } from 'rxjs';
import { RoomPaginateI, UserI } from 'src/app/models/interfaces';
import { RoomService } from '../../services';

@Component({
  selector: 'app-public-rooms',
  templateUrl: './public-rooms.component.html',
  styleUrls: ['./public-rooms.component.scss']
})
export class PublicRoomsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  paginatedRooms: RoomPaginateI;
  searchRoom = new FormControl(null);
  private waitingForPagination: boolean;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const getAllRoomsSubscription =
      this.roomService.getAllRooms().pipe(
        tap(paginatedRooms => {
          if (this.searchRoom.value != null) {
            this.paginatedRooms = paginatedRooms;
          }
          if (this.isPaginationResponse(paginatedRooms)) {
            this.waitingForPagination = false;
            this.paginatedRooms = paginatedRooms;
          }
        }),
        skipWhile(() => this.searchRoom.value != null),
        throttleTime(10000),
      ).subscribe(paginatedRooms => {
        this.paginatedRooms = paginatedRooms;
      });
    this.subscription.add(getAllRoomsSubscription);

    const searchRoomSubscription =
      this.searchRoom.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((roomTitle: string) => {
        this.roomService.filterAllRooms(roomTitle);
      });
    this.subscription.add(searchRoomSubscription);

    this.roomService.emitPaginateAllRooms();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goToCreateRooms(): void {
    this.router.navigate(['../create-room'], { relativeTo: this.activatedRoute });
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.waitingForPagination = true;
    const searchValue = this.searchRoom.value as string;
    this.roomService.emitPaginateAllRooms(pageEvent.pageSize, pageEvent.pageIndex, searchValue);
  }

  joinRoom(event: any): void {
    this.router.navigate(['../room'], { relativeTo: this.activatedRoute });
  }

  private isPaginationResponse(paginatedRooms: RoomPaginateI) {
    if (!this.waitingForPagination) {
      return false;
    }
    if (this.paginatedRooms.meta.currentPage == paginatedRooms.meta.currentPage &&
      this.paginatedRooms.meta.itemsPerPage == paginatedRooms.meta.itemsPerPage) {
      return false;
    }
    return true;
  }

}
