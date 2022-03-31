import { UserI } from "src/user/models/user.interface";
import { AddedUserRoomI } from "../added-user-room/added-user-room.interface";

export interface RoomI {
    id?: number;
    name?: string;
    description?: string;
    creator?: UserI;
    users?: AddedUserRoomI[];
    createdAt?: Date;
    updatedAt?: Date;
}