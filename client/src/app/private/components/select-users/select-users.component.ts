import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UserI } from 'src/app/models/interfaces';
import { AuthenticationService, UserService } from 'src/app/public/services';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss']
})
export class SelectUsersComponent implements OnInit {

  @Input() users: UserI[] = null;
  
  @Output() addUser = new EventEmitter<UserI>();
  @Output() removeUser = new EventEmitter<UserI>();

  searchUsername = new FormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = null;
  loggedInUser: UserI = this.authenticationService.getLoggedInUser();

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.searchUsername.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(async (username: string) => {
        const users = await this.userService.findByUsername(username);
        this.filteredUsers = users.filter((user: UserI) => user.id !== this.loggedInUser.id);
      })
    )
      .subscribe();
  }

  emitAddUser(): void {
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    this.selectedUser = null;
    this.searchUsername.setValue(null);
  }

  emitRemoveUser(user: UserI): void {
    this.removeUser.emit(user);
  }

  setSelectedUser(user: UserI): void {
    this.selectedUser = user;
  }

  autocompleteDisplay(user: UserI): string {
    return user ? user.username : "";
  }
}
