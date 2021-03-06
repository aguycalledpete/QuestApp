import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/models/connected-user/connected-user.entity';
import { ConnectedUserI } from 'src/chat/models/connected-user/connected-user.interface';
import { UserI } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {

    constructor(
        @InjectRepository(ConnectedUserEntity)
        private readonly connectedUserRepository: Repository<ConnectedUserEntity>
    ) { }

    async save(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
        return this.connectedUserRepository.save(connectedUser);
    }

    async create(socketId: string, user: UserI): Promise<ConnectedUserI> {
        const connectedUser: ConnectedUserI = {
            socketId,
            user
        };
        return this.connectedUserRepository.save(connectedUser);
    }

    async getAll(): Promise<ConnectedUserI[]> {
        return this.connectedUserRepository.find({ order: { id: "DESC" }});
    }

    async findByUser(user: UserI): Promise<ConnectedUserI[]> {
        return this.connectedUserRepository.find({ user });
    }

    async deleteBySocketId(socketId: string) {
        return this.connectedUserRepository.delete({ socketId });
    }

    async deleteAll() {
        return this.connectedUserRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }

}
