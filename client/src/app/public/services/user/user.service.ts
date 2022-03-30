import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/models/interfaces';
import { ConstantsService, SnackBarService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private constantsService: ConstantsService,
    private snackBarService: SnackBarService
  ) { }

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
