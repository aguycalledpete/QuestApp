import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { PrivateRoutingModule } from './private-routing.module';
import {
  SelectUsersComponent, ChatRoomComponent, ChatMessageComponent,
  PageFooterComponent, PageHeaderComponent, RoomListItemComponent
} from './components';
import {
  CreateRoomComponent, DashboardComponent, FriendsComponent,
  MyRoomsComponent, NotesComponent, PrivatePagesContainerComponent,
  ProfileComponent, PublicRoomsComponent
} from './pages';
import { SharedComponentsModule } from '../components/components.module';

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
    RouterModule,
    SharedComponentsModule,
    MatListModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class PrivateModule { }
