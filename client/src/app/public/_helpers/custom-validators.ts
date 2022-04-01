import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static validEmail(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const validEmailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        const isValidEmail = validEmailRegex.test(value);
        if (!isValidEmail) {
            const validationErrors: ValidationErrors = { invalidEmail: true };
            return validationErrors;
        }
        return null;
    }

    static noInvalidCharacters(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const validCharactersRegex: RegExp = /^[a-zA-Z0-9_]*$/;
        const containsOnlyValidCharacters = validCharactersRegex.test(value);
        if (!containsOnlyValidCharacters) {
            const validationErrors: ValidationErrors = { containsInvalidCharacters: true };
            return validationErrors;
        }
        return null;
    }

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