import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { lastValueFrom } from 'rxjs';
import { LoginResponseI, UserI } from 'src/app/models/interfaces';
import { ConstantsService, SnackBarService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private jwtService: JwtHelperService,
    private constantsService: ConstantsService
  ) { }

  async login(user: UserI): Promise<LoginResponseI> {
    const loginResponse: LoginResponseI = await lastValueFrom(
      this.http.post<LoginResponseI>(this.constantsService.API_LOGIN, user)
    );
    localStorage.setItem('QuestAppToken', loginResponse.access_token);
    this.snackBarService.displayMatSnackBar(`Login Successful`);
    return loginResponse;
  }

  getLoggedInUser(): UserI {
    const decodedToken = this.jwtService.decodeToken();
    const loggedInUser: UserI = decodedToken.user;
    return loggedInUser;
  }

}
