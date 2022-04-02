import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from 'src/app/models/interfaces';
import { UserService } from '../../services';
import { CustomValidators } from '../../_helpers/custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, CustomValidators.validEmail]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async login(): Promise<void> {
    if (!this.form.valid) {
      return;
    }

    const userToLogin: UserI = {
      email: this.email.value,
      password: this.password.value
    };

    const loginResponse = await this.userService.login(userToLogin);
    if (!loginResponse.isSuccessful) {
      return;
    }

    this.router.navigate(['../../private/process-login'], { relativeTo: this.activatedRoute });
  }

  goToCreateAccount() {
    this.router.navigate(['../create-account'], { relativeTo: this.activatedRoute });
  }

  goToForgotPassword() {
    this.router.navigate(['../forgot-password/find-account'], { relativeTo: this.activatedRoute });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

}
