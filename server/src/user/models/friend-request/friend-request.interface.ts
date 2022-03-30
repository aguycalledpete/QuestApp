import { UserEntity } from "../user.entity";
import { FriendRequestStatusEnum } from "./friend-request-status.enum";

export interface FriendRequestI {
    id?: number;
    requester: UserEntity;
    addressee: UserEntity;
    status?: FriendRequestStatusEnum;
}