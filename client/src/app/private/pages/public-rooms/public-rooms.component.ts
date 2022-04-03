import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, delay, distinctUntilChanged, lastValueFrom, of, skipWhile, Subscription, tap, throttleTime } from 'rxjs';
import { RoomPaginateI } from 'src/app/models/interfaces';
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

  async ngOnInit(): Promise<void> {
    const getPublicRoomsSubscription =
      this.roomService.getPublicRooms().pipe(
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
    this.subscription.add(getPublicRoomsSubscription);

    const searchRoomSubscription =
      this.searchRoom.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((roomTitle: string) => {
        this.roomService.filterPublicRooms(roomTitle);
      });
    this.subscription.add(searchRoomSubscription);


    await lastValueFrom(
      of(delay(1000)).pipe(
        tap(() => {
          this.roomService.emitPaginatePublicRooms();
        })
      ));
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
    this.roomService.emitPaginatePublicRooms(pageEvent.pageSize, pageEvent.pageIndex, searchValue);
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
