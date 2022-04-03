import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async findMessagesForRoom(roomId: number): Promise<MessageI[]> {
        const foundMessages = this.messageRepository.find({
            where: {
                room: { id: roomId }
            },
            relations: ['room', 'user']
        });
        return foundMessages;
    }

}
