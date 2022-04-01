import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PrivatePagesContainerComponent, PublicRoomsComponent, NotesComponent,
  MyRoomsComponent, FriendsComponent, ProfileComponent,
  DashboardComponent, CreateRoomComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: PrivatePagesContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'public-rooms',
        pathMatch: 'full'
      },
      {
        path: 'public-rooms',
        component: PublicRoomsComponent
      },
      {
        path: 'notes',
        component: NotesComponent
      },
      {
        path: 'my-rooms',
        component: MyRoomsComponent
      },
      {
        path: 'friends',
        component: FriendsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'create-room',
        component: CreateRoomComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'private/public-rooms',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
