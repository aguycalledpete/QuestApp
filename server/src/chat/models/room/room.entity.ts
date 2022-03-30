import { UserEntity } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];

    // @ManyToOne(() => UserEntity)
    // @JoinTable()
    // creator: UserEntity;

    @OneToMany(() => ConnectedUserRoomEntity, connectedUser => connectedUser.room)
    connectedUsers: ConnectedUserRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.room)
    messages: MessageEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}