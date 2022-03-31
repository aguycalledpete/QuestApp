import { UserEntity } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";

@Entity()
export class AddedUserRoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.rooms)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.users)
    @JoinColumn()
    room: RoomEntity;

    @Column()
    role: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}