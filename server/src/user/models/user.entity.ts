import { ConnectedUserEntity } from "src/chat/models/connected-user/connected-user.entity";
import { ConnectedUserRoomEntity } from "src/chat/models/connected-user-room/connected-user-room.entity";
import { MessageEntity } from "src/chat/models/message/message.entity";
import {
    BeforeInsert, BeforeUpdate, Column,
    CreateDateColumn, Entity, OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { AddedUserRoomEntity } from "src/chat/models/added-user-room/added-user-room.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ select: false })
    securityQuestion: string;

    @Column({ select: false })
    securityAnswer: string;

    @OneToMany(() => ConnectedUserEntity, connection => connection.user)
    connections: ConnectedUserEntity[]

    @OneToMany(() => AddedUserRoomEntity, addedUser => addedUser.user)
    rooms: AddedUserRoomEntity[];

    @OneToMany(() => ConnectedUserRoomEntity, connectedRoom => connectedRoom.room)
    connectedRooms: ConnectedUserRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.user)
    messages: MessageEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}