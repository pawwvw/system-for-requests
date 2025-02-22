import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"


enum Status {
    'new', 'in_progress', 'completed', 'canceled'
}


@Entity()
export class Request {

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
