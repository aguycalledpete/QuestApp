import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AddedUserRoomEntity } from 'src/chat/models/added-user-room/added-user-room.entity';
import { AddedUserRoomI } from 'src/chat/models/added-user-room/added-user-room.interface';
import { UserRoleEnum } from 'src/chat/models/added-user-room/user-role.enum';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserI } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AddedUserRoomService {

    constructor(
        @InjectRepository(AddedUserRoomEntity)
        private readonly addedUserRoomRepository: Repository<AddedUserRoomEntity>
    ) { }

    async addUsersToRoom(users: UserI[], room: RoomI, creator?: UserI): Promise<AddedUserRoomI[]> {
        let addedUsers = new Array<AddedUserRoomI>();
        if (creator) {
            users.push(creator);
        }
        for (const user of users) {
            const role = user === creator ? UserRoleEnum.Creator : UserRoleEnum.None;
            const userToAdd: AddedUserRoomI = {
                user, room, role
            }
            const addedUser = await this.create(userToAdd);
            addedUsers.push(addedUser);
        }
        return addedUsers;
    }

    async create(addedUserRoom: AddedUserRoomI): Promise<AddedUserRoomI> {
        const createdAddedUserRoom = await this.addedUserRoomRepository.save(addedUserRoom);
        return createdAddedUserRoom;
    }

    async findAddedUserByRoom(roomId: number): Promise<AddedUserRoomI[]> {
        const found = this.addedUserRoomRepository.find({
            where: {
                room: { id: roomId }
            },
            relations: ['room', 'user']
        });
        return found;
    }

    async isUserIdAddedToRoom(roomId: number, userId: number): Promise<boolean> {
        const addedUserRooms = await this.addedUserRoomRepository.find({
            where: {
                room: { id: roomId },
                user: { id: userId }
            },
            relations: ['room', 'user']
        });
        return addedUserRooms != null && addedUserRooms.length > 0;
    }

    async deleteByUserId(userId: number) {
        return this.addedUserRoomRepository
            .createQueryBuilder('addedUserRoom')
            .leftJoin('user_entity', 'user', 'addedUserRoom.userId = user.id')
            .delete()
            .where("user.id = :id", { id: userId })
            .execute();
    }

    async deleteByRoomId(roomId: number) {
        return this.addedUserRoomRepository
            .createQueryBuilder('addedUserRoom')
            .leftJoin('room_entity', 'room', 'addedUserRoom.userId = room.id')
            .delete()
            .where("room.id = :id", { id: roomId })
            .execute();
    }

    async deleteByRoomAndUser(roomId: number, userId: number) {
        return this.addedUserRoomRepository
            .createQueryBuilder('addedUserRoom')
            .leftJoin('room_entity', 'room', 'addedUserRoom.roomId = room.id')
            .leftJoin('user_entity', 'user', 'addedUserRoom.userId = user.id')
            .delete()
            .where("room.id = :roomId", { roomId })
            .andWhere("user.id = :userId", { userId })
            .execute();
    }

}
