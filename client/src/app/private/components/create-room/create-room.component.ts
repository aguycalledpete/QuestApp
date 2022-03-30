import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomI, UserI } from 'src/app/models/interfaces';
import { ChatService } from '../../services';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    users: new FormArray([], [Validators.required]),
  });

  constructor(
    private chatService: ChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  create(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue: RoomI = this.form.getRawValue();
    this.chatService.createRoom(formValue);
    this.router.navigate(['../dashboard'], { relativeTo: this.activatedRoute })
  }

  addUser(user: UserI): void {
    const userToInitialize = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const userFormControl = new FormControl(userToInitialize);
    this.users.push(userFormControl);
  }

  removeUser(user: UserI): void {
    const userIndex = this.users.value.findIndex((arrayUser: UserI) => arrayUser.id == user.id);
    this.users.removeAt(userIndex);
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

}
