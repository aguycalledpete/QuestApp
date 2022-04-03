import { UserI } from "src/user/models/user.interface";
import { RoomI } from "../room/room.interface";
import { MessageTypeEnum } from "./message-type.enum";

export interface MessageI {
    id?: number;
    text: string;
    user: UserI;
    room: RoomI;
    messageType: MessageTypeEnum;
    createdAt?: Date;
}