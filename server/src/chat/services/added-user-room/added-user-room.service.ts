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

    async addUsersToRoom(users: UserI[], room: RoomI): Promise<AddedUserRoomI[]> {
        let addedUsers = new Array<AddedUserRoomI>();
        for (const user of users) {
            const userRole = user === room.creator ? UserRoleEnum.Administrator : UserRoleEnum.None;
            const userToAdd: AddedUserRoomI = {
                user: user,
                room: room,
                role: userRole
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

}
