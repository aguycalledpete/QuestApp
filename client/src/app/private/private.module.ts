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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { PrivateRoutingModule } from './private-routing.module';
import {
  SelectUsersComponent, ChatMessageComponent,
  PageFooterComponent, PageHeaderComponent, RoomListItemComponent
} from './components';
import {
  CreateRoomComponent, MyRoomsComponent, PrivatePagesContainerComponent,
  ProcessLoginComponent, ProfileComponent, PublicRoomsComponent,
  RoomComponent
} from './pages';
import { SharedComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    CreateRoomComponent,
    SelectUsersComponent,
    ChatMessageComponent,
    PublicRoomsComponent,
    MyRoomsComponent,
    ProfileComponent,
    PageFooterComponent,
    PageHeaderComponent,
    PrivatePagesContainerComponent,
    RoomListItemComponent,
    RoomComponent,
    ProcessLoginComponent
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
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class PrivateModule { }
