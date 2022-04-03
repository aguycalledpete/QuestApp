import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/models/message/message.entity';
import { MessageI } from 'src/chat/models/message/message.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>
    ) { }

    async create(message: MessageI): Promise<MessageI> {
        const createdMessage = this.messageRepository.create(message);
        return this.messageRepository.save(createdMessage);
    }

    async findMessagesForRoom(roomId: number, options: IPaginationOptions): Promise<Pagination<MessageI>> {
        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId })
            .leftJoinAndSelect('message.user', 'user')
            .orderBy('message.createdAt', 'DESC');

        return paginate(query, options);
    }

}
