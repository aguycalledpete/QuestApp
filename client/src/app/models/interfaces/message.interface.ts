import { MetaI } from "./meta.interface";
import { RoomI } from "./room.interface";
import { UserI } from "./user.interface";

export interface MessageI {
    id?: number;
    text: string;
    user?: UserI;
    room: RoomI;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MessagePaginateI {
    items: MessageI[];
    meta: MetaI;
}