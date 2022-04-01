import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { LoginResponseI, UserI } from 'src/app/models/interfaces';
import { ConstantsService, LocalStorageService, SnackBarService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedInUser: UserI;

  constructor(
    private httpClient: HttpClient,
    private snackBarService: SnackBarService,
    private constantsService: ConstantsService,
    private localStorageService: LocalStorageService
  ) {
    const storedUser = this.localStorageService.getValueParsed<UserI>(this.constantsService.STORAGE_USER);
    if (storedUser) {
      this.loggedInUser = storedUser;
    }
  }

  async login(userToLogin: UserI): Promise<LoginResponseI> {
    const loginResponse: LoginResponseI = await lastValueFrom(
      this.httpClient.post<LoginResponseI>(this.constantsService.API_LOGIN, userToLogin)
    );
    if (!loginResponse.isSuccessful) {
      this.snackBarService.displayMatSnackBar(`Login Failed`, 5000);
      return loginResponse;
    }

    const loggedInUser = await this.findByEmail(userToLogin.email);
    this.loggedInUser = loggedInUser;
    this.snackBarService.displayMatSnackBar(`Login Successful`);

    this.localStorageService.store(this.constantsService.STORAGE_TOKEN, loginResponse.accessToken);
    this.localStorageService.store(this.constantsService.STORAGE_USER, loggedInUser, true);

    return loginResponse;
  }

  async findByEmail(email: string): Promise<UserI> {
    const foundUser = await lastValueFrom(
      this.httpClient.get<UserI>(`${this.constantsService.API_FIND_BY_EMAIL}?email=${email}`)
    );
    return foundUser;
  }

  async findByUsername(username: string): Promise<UserI[]> {
    const foundUsers = await lastValueFrom(
      this.httpClient.get<UserI[]>(`${this.constantsService.API_FIND_BY_USERNAME}?username=${username}`)
    );
    return foundUsers;
  }

  async create(user: UserI): Promise<UserI> {
    const createdUser = await lastValueFrom(
      this.httpClient.post<UserI>(this.constantsService.API_USER, user).pipe(
        tap((createdUser: UserI) =>
          this.snackBarService.displayMatSnackBar(`User ${createdUser.username} created successfully`)
        ),
        catchError(error => {
          this.snackBarService.displayMatSnackBar(`User could not be created, due to '${error.error.message}'`, 5000);
          return throwError(() => error);
        })
      ));

    return createdUser;
  }
}
