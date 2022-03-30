import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, tap } from 'rxjs';
import { UserI } from 'src/app/models/interfaces';
import { ForgotPasswordService, UserService } from 'src/app/public/services';
import { fadeDownIn, fadeUpOut } from 'src/app/services/constants/animations';

@Component({
  selector: 'app-find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.scss'],
  animations: [
    trigger('dropInOut', [
      transition(':enter', useAnimation(fadeDownIn, { params: { duration: '350ms' } })),
      transition(':leave', useAnimation(fadeUpOut, { params: { duration: '350ms' } }))
    ])]
})
export class FindAccountComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  foundUser: UserI;

  constructor(
    private userService: UserService,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.forgotPasswordService.reset();

    this.email.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => this.foundUser = null)
    )
      .subscribe();
  }

  async findAccount() {
    if (!this.form.valid) {
      return;
    }

    const email = this.email.value;
    const user = await this.userService.findByEmail(email);
    this.foundUser = user;
  }

  goToLogin() {
    this.router.navigate(['../../login'], { relativeTo: this.activatedRoute });
  }

  goToSecurityCheck() {
    this.forgotPasswordService.user = this.foundUser;
    this.router.navigate(['../security-check'], { relativeTo: this.activatedRoute });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

}
