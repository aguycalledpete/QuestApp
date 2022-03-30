import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserI } from 'src/app/models/interfaces';
import { ConstantsService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  user: UserI;

  constructor(
    private httpClient: HttpClient,
    private constantsService: ConstantsService
  ) { }

  reset() {
    this.user = null;
  }

  async checkSecurityAnswer(user: UserI): Promise<boolean> {
    if (!user || !user.securityAnswer) {
      return false;
    }

    try {
      const isValid = await lastValueFrom(
        this.httpClient.post<boolean>(`${this.constantsService.API_ANSWER_QUESTION}`, user)
      );
      return isValid;
    } catch (error) {
      return false;
    }
  }

  async setNewPassword(user: UserI): Promise<boolean> {
    if (!user || !user.securityAnswer) {
      return false;
    }

    try {
      const isValid = await lastValueFrom(
        this.httpClient.post<boolean>(`${this.constantsService.API_RESET_PASSWORD}`, user)
      );
      return isValid;
    } catch (error) {
      return false;
    }
  }

}
