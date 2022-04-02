import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PrivatePagesContainerComponent, PublicRoomsComponent,
  MyRoomsComponent, FriendsComponent, ProfileComponent,
  CreateRoomComponent,
  ProcessLoginComponent
} from './pages';
import { RoomComponent } from './pages/room/room.component';

const routes: Routes = [
  {
    path: 'process-login',
    component: ProcessLoginComponent
  },
  {
    path: '',
    component: PrivatePagesContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'process-login',
        pathMatch: 'full'
      },
      {
        path: 'public-rooms',
        component: PublicRoomsComponent
      },
      {
        path: 'my-rooms',
        component: MyRoomsComponent
      },
      {
        path: 'create-room',
        component: CreateRoomComponent
      },
      {
        path: 'room',
        component: RoomComponent
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            component: ProfileComponent
          },
          {
            path: 'friends',
            component: FriendsComponent
          },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'private/process-login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
