import { Column, Entity,CreateDateColumn,UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class test{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name : string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}