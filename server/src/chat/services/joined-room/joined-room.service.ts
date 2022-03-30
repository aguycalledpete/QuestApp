import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/models/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/models/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserI } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {

    constructor(
        @InjectRepository(JoinedRoomEntity)
        private readonly JoinedRoomRepository: Repository<JoinedRoomEntity>
    ) { }

    async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
        return this.JoinedRoomRepository.save(joinedRoom);
    }

    async findByUser(user: UserI): Promise<JoinedRoomI[]> {
        return this.JoinedRoomRepository.find({ user });
    }

    async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
        return this.JoinedRoomRepository.find({ room });
    }

    async deleteBySocketId(socketId: string) {
        return this.JoinedRoomRepository.delete({ socketId });
    }

    async deleteAll() {
        await this.JoinedRoomRepository.
            createQueryBuilder()
            .delete()
            .execute();
    }

}
