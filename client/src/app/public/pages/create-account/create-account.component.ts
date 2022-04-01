import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../../_helpers/custom-validators';
import { UserI } from 'src/app/models/interfaces';
import { UserService } from '../../services';
import { ConstantsService } from 'src/app/services';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, CustomValidators.validEmail]),
    username: new FormControl(null, [Validators.required, CustomValidators.noInvalidCharacters]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required]),
    securityQuestion: new FormControl(null, [Validators.required]),
    securityAnswer: new FormControl(null, [Validators.required]),
    securityAnswerConfirm: new FormControl(null, [Validators.required])
  },
    {
      validators: [
        CustomValidators.passwordsMatching,
        CustomValidators.securityAnswersMatching
      ]
    });

  securityQuestions: string[] = this.constantsService.SECURITY_QUESTIONS;

  constructor(
    private userService: UserService,
    private constantsService: ConstantsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async createUser(): Promise<void> {
    if (!this.form.valid) {
      return;
    }

    const userToCreate: UserI = {
      email: this.email.value,
      username: this.username.value,
      password: this.password.value,
      securityQuestion: this.securityQuestion.value,
      securityAnswer: this.securityAnswer.value,
    };

    const createdUser = await this.userService.create(userToCreate);
    if (!createdUser) {
      return;
    }

    this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
  }

  goToLogin() {
    this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this.form.get('passwordConfirm') as FormControl;
  }

  get securityQuestion(): FormControl {
    return this.form.get('securityQuestion') as FormControl;
  }

  get securityAnswer(): FormControl {
    return this.form.get('securityAnswer') as FormControl;
  }

  get securityAnswerConfirm(): FormControl {
    return this.form.get('securityAnswerConfirm') as FormControl;
  }

}
