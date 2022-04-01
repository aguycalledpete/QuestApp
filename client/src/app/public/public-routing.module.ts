import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CompleteComponent, CreateAccountComponent, FindAccountComponent,
  LoginComponent, NewPasswordComponent, PublicPagesContainerComponent,
  SecurityCheckComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: PublicPagesContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'create-account',
        component: CreateAccountComponent
      },
      {
        path: 'forgot-password',
        children: [
          {
            path: '',
            redirectTo: 'find-account',
            pathMatch: 'full'
          },
          {
            path: 'find-account',
            component: FindAccountComponent
          },
          {
            path: 'security-check',
            component: SecurityCheckComponent
          },
          {
            path: 'new-password',
            component: NewPasswordComponent
          },
          {
            path: 'complete',
            component: CompleteComponent
          },
        ]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'public/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
