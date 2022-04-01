import { UserRoleEnum } from "../enums";
import { RoomI } from "./room.interface";
import { UserI } from "./user.interface";

export interface AddedUserRoomI {
    id?: number;
    user?: UserI;
    room?: RoomI;
    role?: UserRoleEnum;
    createdAt?: Date;
    updatedAt?: Date;
}