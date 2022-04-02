import { AddedUserRoomI } from "./added-user-room.interface";
import { ConnectedUserRoomI } from "./connected-user-room.interface";
import { MessageI } from "./message.interface";
import { MetaI } from "./meta.interface";

export interface RoomI {
    id?: number;
    title?: string;
    description?: string;
    users?: AddedUserRoomI[];
    connectedUsers?: ConnectedUserRoomI[];
    messages?: MessageI[];
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoomPaginateI {
    items: RoomI[];
    meta: MetaI;
}