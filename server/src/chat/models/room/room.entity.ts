import { UserEntity } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AddedUserRoomEntity } from "../added-user-room/added-user-room.entity";
import { ConnectedUserRoomEntity } from "../connected-user-room/connected-user-room.entity";
import { MessageEntity } from "../message/message.entity";

@Entity()
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => UserEntity)
    creator: UserEntity;

    @OneToMany(() => AddedUserRoomEntity, addedUser => addedUser.room)
    users: AddedUserRoomEntity[];

    @OneToMany(() => ConnectedUserRoomEntity, connectedUser => connectedUser.room)
    connectedUsers: ConnectedUserRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.room)
    messages: MessageEntity[];

    @Column({ nullable: true })
    isPublic: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}