import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent, CreateAccountComponent } from './components';
import { CompleteComponent } from './components/forgot-password/complete/complete.component';
import { FindAccountComponent } from './components/forgot-password/find-account/find-account.component';
import { NewPasswordComponent } from './components/forgot-password/new-password/new-password.component';
import { SecurityCheckComponent } from './components/forgot-password/security-check/security-check.component';

const routes: Routes = [
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
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
