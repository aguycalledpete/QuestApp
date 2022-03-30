import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'

import { LoginComponent, CreateAccountComponent } from './components';
import { MatSelectModule } from '@angular/material/select';
import { FindAccountComponent } from './components/forgot-password/find-account/find-account.component';
import { SecurityCheckComponent } from './components/forgot-password/security-check/security-check.component';
import { NewPasswordComponent } from './components/forgot-password/new-password/new-password.component';
import { CompleteComponent } from './components/forgot-password/complete/complete.component';

@NgModule({
  declarations: [
    LoginComponent,
    CreateAccountComponent,
    FindAccountComponent,
    SecurityCheckComponent,
    NewPasswordComponent,
    CompleteComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class PublicModule { }
