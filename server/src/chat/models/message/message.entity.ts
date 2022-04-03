import { UserEntity } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";
import { MessageTypeEnum } from "./message-type.enum";

@Entity()
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, user => user.messages)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.messages)
    @JoinColumn()
    room: RoomEntity;

    @Column()
    messageType: MessageTypeEnum;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}