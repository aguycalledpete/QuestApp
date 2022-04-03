import { MessageTypeEnum } from "../enums/message-type.enum";
import { MetaI } from "./meta.interface";
import { RoomI } from "./room.interface";
import { UserI } from "./user.interface";

export interface MessageI {
    id?: number;
    text: string;
    user?: UserI;
    room: RoomI;
    messageType: MessageTypeEnum;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MessagePaginateI {
    items: MessageI[];
    meta: MetaI;
}