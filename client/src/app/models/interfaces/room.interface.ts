import { AddedUserRoomI } from "./added-user-room.interface";
import { MetaI } from "./meta.interface";
import { UserI } from "./user.interface";

export interface RoomI {
    id?: number;
    title?: string;
    description?: string;
    creator?: UserI;
    users?: AddedUserRoomI[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoomPaginateI {
    items: RoomI[];
    meta: MetaI;
}