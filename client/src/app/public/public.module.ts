import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { PublicRoutingModule } from './public-routing.module';
import {
  LoginComponent, CreateAccountComponent, FindAccountComponent,
  SecurityCheckComponent, NewPasswordComponent, CompleteComponent,
  PublicPagesContainerComponent
} from './pages';
import { SharedComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    LoginComponent,
    CreateAccountComponent,
    FindAccountComponent,
    SecurityCheckComponent,
    NewPasswordComponent,
    CompleteComponent,
    PublicPagesContainerComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class PublicModule { }
