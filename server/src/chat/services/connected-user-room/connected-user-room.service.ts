import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserRoomEntity } from 'src/chat/models/connected-user-room/connected-user-room.entity';
import { ConnectedUserRoomI } from 'src/chat/models/connected-user-room/connected-user-room.interface';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserI } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserRoomService {

    constructor(
        @InjectRepository(ConnectedUserRoomEntity)
        private readonly ConnectedRoomRepository: Repository<ConnectedUserRoomEntity>
    ) { }

    async create(connectedRoom: ConnectedUserRoomI): Promise<ConnectedUserRoomI> {
        return this.ConnectedRoomRepository.save(connectedRoom);
    }

    async findByUser(user: UserI): Promise<ConnectedUserRoomI[]> {
        return this.ConnectedRoomRepository.find({ user });
    }

    async findByRoom(room: RoomI): Promise<ConnectedUserRoomI[]> {
        return this.ConnectedRoomRepository.find({ room });
    }

    async deleteBySocketId(socketId: string) {
        return this.ConnectedRoomRepository.delete({ socketId });
    }

    async deleteAll() {
        await this.ConnectedRoomRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }

}
