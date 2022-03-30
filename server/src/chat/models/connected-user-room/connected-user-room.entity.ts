import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";

@Entity()
export class ConnectedUserRoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string;

    @ManyToOne(() => UserEntity, user => user.connectedRooms)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(()=> RoomEntity, room => room.connectedUsers)
    @JoinColumn()
    room: RoomEntity;
}