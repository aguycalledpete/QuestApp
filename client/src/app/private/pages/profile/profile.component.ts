import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/models/interfaces';
import { UserService } from 'src/app/public/services';
import { ConstantsService, LocalStorageService, SnackBarService } from 'src/app/services';
import { ProfileService } from '../../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserI = this.userService.loggedInUser;

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  goToFriendsList(): void {
    this.router.navigate(['./friends'], { relativeTo: this.activatedRoute });

  }

  logOut(): void {
    this.profileService.logOut();
  }

}
