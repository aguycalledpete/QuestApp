import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, tap } from 'rxjs';
import { ForgotPasswordService } from 'src/app/public/services';
import { CustomValidators } from 'src/app/public/_helpers/custom-validators';
import { SnackBarService } from 'src/app/services';

@Component({
  selector: 'app-security-check',
  templateUrl: './security-check.component.html',
  styleUrls: ['./security-check.component.scss']
})
export class SecurityCheckComponent implements OnInit {

  securityQuestion: string;
  isAnswerValid: boolean = null;

  form: FormGroup = new FormGroup({
    securityAnswer: new FormControl(null, [Validators.required]),
    securityAnswerConfirm: new FormControl(null, [Validators.required])
  },
    {
      validators: [
        CustomValidators.securityAnswersMatching
      ]
    });

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    merge(
      this.securityAnswer.valueChanges,
      this.securityAnswerConfirm.valueChanges
    ).pipe(
      tap(() => this.isAnswerValid = null)
    ).subscribe();

    this.securityQuestion = this.forgotPasswordService.user.securityQuestion;
  }

  async checkSecurityAnswer(): Promise<void> {
    if (!this.form.valid) {
      return;
    }

    const user = this.forgotPasswordService.user;
    user.securityAnswer = this.securityAnswer.value;
    this.isAnswerValid = await this.forgotPasswordService.checkSecurityAnswer(user);
    if (!this.isAnswerValid) {
      this.snackBarService.displayMatSnackBar('Answer is not valid');
      return;
    }

    this.router.navigate(['../new-password'], { relativeTo: this.activatedRoute });
  }

  goToLogin(): void {
    this.router.navigate(['../../login'], { relativeTo: this.activatedRoute });
  }

  get securityAnswer(): FormControl {
    return this.form.get('securityAnswer') as FormControl;
  }

  get securityAnswerConfirm(): FormControl {
    return this.form.get('securityAnswerConfirm') as FormControl;
  }

}
