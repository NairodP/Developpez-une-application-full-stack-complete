import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const hasNumber = /\d/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasNumber && hasLower && hasUpper && hasSpecial && hasMinLength;

      if (!passwordValid) {
        return {
          strongPassword: {
            hasNumber,
            hasLower,
            hasUpper,
            hasSpecial,
            hasMinLength
          }
        };
      }

      return null;
    };
  }

  static getPasswordRequirements(control: AbstractControl): string[] {
    const errors = [];
    const value = control.value ?? '';

    if (value.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/\d/.test(value)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('Au moins une lettre minuscule');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('Au moins une lettre majuscule');
    }
    if (!/[#?!@$%^&*-]/.test(value)) {
      errors.push('Au moins un caractère spécial (#?!@$%^&*-)');
    }

    return errors;
  }
}
