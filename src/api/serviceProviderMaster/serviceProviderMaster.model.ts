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
  serviceProviderId: string;

  @Column()
  serviceProviderName: string;

  @Column()
  companyId: string;

  @Column({'nullable': true})
  Website: string;

  @Column()
  contactNumber: string;

  @Column()
  tollFreeNumber: string;

  @Column()
  Address: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
