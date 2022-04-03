import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/public/services';
import { ConstantsService, LocalStorageService, SnackBarService } from 'src/app/services';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private socket: CustomSocket,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private constantsService: ConstantsService,
    private snackBarService: SnackBarService,
    private router: Router
  ) { }

  logOut(): void {
    this.socket.emit(this.constantsService.SOCKET_TO_LOGOUT);
    this.localStorageService.delete(this.constantsService.STORAGE_USER);
    this.localStorageService.delete(this.constantsService.STORAGE_TOKEN);
    this.snackBarService.displayMatSnackBar('Logged out');
    this.userService.loggedInUser = null;
    this.router.navigate(['public/login']);
  }

}
