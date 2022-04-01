import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';

import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import {
  SelectUsersComponent, ChatRoomComponent, ChatMessageComponent,
  PageFooterComponent, PageHeaderComponent
} from './components';
import {
  CreateRoomComponent, DashboardComponent, FriendsComponent,
  MyRoomsComponent, NotesComponent, PrivatePagesContainerComponent,
  ProfileComponent, PublicRoomsComponent
} from './pages';
import { RoomListItemComponent } from './components/room-list-item/room-list-item.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateRoomComponent,
    SelectUsersComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    PublicRoomsComponent,
    NotesComponent,
    MyRoomsComponent,
    FriendsComponent,
    ProfileComponent,
    PageFooterComponent,
    PageHeaderComponent,
    PrivatePagesContainerComponent,
    RoomListItemComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MatListModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule
  ]
})
export class PrivateModule { }
