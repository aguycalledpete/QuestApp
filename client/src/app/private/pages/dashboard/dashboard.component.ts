import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomPaginateI, UserI } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/public/services';
import { RoomService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  rooms$: Observable<RoomPaginateI> = this.roomService.getMyRooms();
  selectedRoom = null;
  user: UserI = this.authenticationService.getLoggedInUser();

  constructor(
    private roomService: RoomService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.roomService.emitPaginateRooms();
  }

  ngAfterViewInit(): void {
    this.roomService.emitPaginateRooms();
  }

  onSelectRoom(event: MatSelectionListChange): void {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(event: PageEvent): void {
    this.roomService.emitPaginateRooms(event.pageSize, event.pageIndex);
  }

}
