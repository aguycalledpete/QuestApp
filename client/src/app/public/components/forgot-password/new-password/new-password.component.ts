import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from 'src/app/public/services';
import { CustomValidators } from 'src/app/public/_helpers/custom-validators';
import { SnackBarService } from 'src/app/services';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {

  form: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required]),
  },
    {
      validators: [
        CustomValidators.passwordsMatching,
      ]
    });

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async setNewPassword(): Promise<void> {
    if (!this.form.valid) {
      return;
    }

    const user = this.forgotPasswordService.user;
    user.password = this.password.value;
    const isSuccessful = await this.forgotPasswordService.setNewPassword(user);
    if (!isSuccessful) {
      this.snackBarService.displayMatSnackBar('Unable to reset password');
      return;
    }

    this.router.navigate(['../complete'], { relativeTo: this.activatedRoute });
  }

  goToLogin(): void {
    this.router.navigate(['../../login'], { relativeTo: this.activatedRoute });
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this.form.get('passwordConfirm') as FormControl;
  }

}
