import { UserI } from "src/user/models/user.interface";
import { AddedUserRoomI } from "../added-user-room/added-user-room.interface";
import { ConnectedUserRoomI } from "../connected-user-room/connected-user-room.interface";
import { MessageI } from "../message/message.interface";

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