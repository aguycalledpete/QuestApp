import { UserI } from "src/user/models/user.interface";

export interface ConnectedUserI {
    id?: number;
    socketId: string;
    user: UserI;
}