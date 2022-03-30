import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomPaginateI, UserI } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/public/services';
import { ChatService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
  selectedRoom = null;
  user: UserI = this.authenticationService.getLoggedInUser();

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.chatService.emitPaginateRooms();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.chatService.emitPaginateRooms();
  }

  onSelectRoom(event: MatSelectionListChange): void {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(event: PageEvent): void {
    this.chatService.emitPaginateRooms(event.pageSize, event.pageIndex);
  }

}
