import { UserI } from "src/user/models/user.interface";
import { RoomI } from "../room/room.interface";

export interface MessageI {
    id?: number;
    text: string;
    user: UserI;
    room: RoomI;
    createdAt: Date;
    updatedAt: Date;
}