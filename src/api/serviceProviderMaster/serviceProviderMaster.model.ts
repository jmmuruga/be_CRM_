import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class serviceProviderMaster {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  serviceProviderName: string;

  @Column()
  website: string;

  @Column()
  contactNumber: string;

  @Column()
  tollFreeNumber: string;

  @Column()
  Address: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
