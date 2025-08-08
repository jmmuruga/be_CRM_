import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class customerDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  customerName: string;

  @Column()
  mobile: string;

  @Column()
  location: string;

  @Column()
  district: string;

    @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
