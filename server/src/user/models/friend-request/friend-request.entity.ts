import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user.entity";

@Entity()
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.sentFriendRequests)
    @JoinColumn()
    requester: UserEntity;

    @ManyToOne(() => UserEntity, user => user.receivedFriendRequests)
    @JoinColumn()
    addressee: UserEntity;

    @Column()
    status: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}