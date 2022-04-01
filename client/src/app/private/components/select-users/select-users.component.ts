import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from 'rxjs';
import { UserI } from 'src/app/models/interfaces';
import { DeviceDetectorService, UserService } from 'src/app/public/services';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss']
})
export class SelectUsersComponent implements OnInit, OnDestroy {

  @Input() users: UserI[] = null;

  @Output() addUser = new EventEmitter<UserI>();
  @Output() removeUser = new EventEmitter<UserI>();

  subscription: Subscription;
  isMobileSize: boolean;
  searchUsername = new FormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = null;
  loggedInUser: UserI = this.userService.loggedInUser;

  constructor(
    private userService: UserService,
    private deviceDetectorService: DeviceDetectorService
  ) {
    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const isMobileSizeSubscription =
      this.deviceDetectorService.isMobileSizeObservable().subscribe(isMobileSize => this.isMobileSize = isMobileSize);
    this.subscription.add(isMobileSizeSubscription);

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
