import { UserI } from "src/user/models/user.interface";
import { RoomI } from "../room/room.interface";

export interface ConnectedUserRoomI {
    id?: number;
    socketId: string;
    user: UserI;
    room: RoomI;
}