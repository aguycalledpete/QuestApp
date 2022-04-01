import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/models/interfaces';
import { UserService } from 'src/app/public/services';
import { ConstantsService, LocalStorageService, SnackBarService } from 'src/app/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserI = this.userService.loggedInUser;

  constructor(
    private userService: UserService,
    private constantsService: ConstantsService,
    private localStorageService: LocalStorageService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.localStorageService.delete(this.constantsService.STORAGE_USER);
    this.localStorageService.delete(this.constantsService.STORAGE_TOKEN);
    this.snackBarService.displayMatSnackBar(`Logged out as ${this.user.username}`);
    this.router.navigate(['./private/login'], { relativeTo: this.activatedRoute });
  }

}
