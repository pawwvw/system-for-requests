import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum Status {
    NEW = 'new', IN_PROGRESS = 'in_progress', COMPLETED = 'completed', CANCELED = 'canceled'
}

@Entity()
export class RequestEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    subject: string

    @Column()
    description: string

    @Column({type: "enum", enum: Status})
    status: Status

    @Column({nullable: true})
    solution: string

    @Column({nullable: true})
    cancellation_reason: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    update_at: Date
}
