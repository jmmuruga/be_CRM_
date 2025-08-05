import { Column, Entity,CreateDateColumn,UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class customerDetails{
    @PrimaryGeneratedColumn()
    id : string;

    @Column()
    customerId : string;

    @Column()
    customerName: string;

    @Column()
    mobileNumber: string;

    @Column()
    emailId: string;

    @Column()
    address: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}