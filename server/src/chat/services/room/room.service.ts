import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/models/room/room.entity';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserI } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) { }

    async createRoom(room: RoomI): Promise<RoomI> {
        const createdRoom = await this.roomRepository.save(room);
        return createdRoom;
    }

    async getRoom(roomId: number): Promise<RoomI> {
        const foundRoom = this.roomRepository.findOne(roomId);
        return foundRoom;
    }

    async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('added_user_room_entity', 'addedUserRoom', 'addedUserRoom.roomId = room.id')
            .leftJoin('user_entity', 'user', 'addedUserRoom.userId = user.id')
            .where('user.id = :userId', { userId })
            .orderBy('room.updatedAt', 'DESC');

        const result = paginate(query, options);
        return result;
    }

    async getPublicRooms(options: IPaginationOptions): Promise<Pagination<RoomI>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .where('room.isPublic = true')
            .orderBy('room.updatedAt', 'DESC');

        const result = paginate(query, options);
        return result;
    }

    async getFilteredPublicRooms(options: IPaginationOptions, searchValue: string): Promise<Pagination<RoomI>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .where('room.isPublic = true')
            .andWhere("room.title like :title", { title:`%${searchValue}%` })
            .orderBy('room.updatedAt', 'DESC');

        const result = paginate(query, options);
        return result;
    }

}
