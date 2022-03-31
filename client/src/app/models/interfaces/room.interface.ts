import { MetaI } from "./meta.interface";
import { UserI } from "./user.interface";

export interface RoomI {
    id?: number;
    name?: string;
    description?: string;
    users?: UserI[];
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoomPaginateI {
    items: RoomI[];
    meta: MetaI;
}