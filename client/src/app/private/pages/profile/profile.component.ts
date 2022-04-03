import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserI } from 'src/app/models/interfaces';
import { UserService } from 'src/app/public/services';
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
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.profileService.logOut();
  }

}
