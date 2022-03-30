import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static passwordsMatching(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;

        if (password !== passwordConfirm || password === null || passwordConfirm === null) {
            const validationErrors: ValidationErrors = { passwordsNotMatching: true };
            return validationErrors;
        }

        return null;
    }

    static securityAnswersMatching(control: AbstractControl): ValidationErrors | null {
        const securityAnswer = control.get('securityAnswer')?.value;
        const securityAnswerConfirm = control.get('securityAnswerConfirm')?.value;

        if (securityAnswer !== securityAnswerConfirm || securityAnswer === null || securityAnswerConfirm === null) {
            const validationErrors: ValidationErrors = { securityAnswersNotMatching: true };
            return validationErrors;
        }

        return null;
    }

}