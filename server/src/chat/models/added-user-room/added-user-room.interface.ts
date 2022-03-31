import { UserI } from "src/user/models/user.interface";
import { RoomI } from "../room/room.interface";
import { UserRoleEnum } from "./user-role.enum";

export interface AddedUserRoomI {
    id?: number;
    user?: UserI;
    room?: RoomI;
    role?: UserRoleEnum;
    createdAt?: Date;
    updatedAt?: Date;
}