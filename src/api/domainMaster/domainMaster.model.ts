import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class domainMaster {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  companyId: string;

  @Column()
  domainMasterId: string;

  @Column()
  serviceProvider: string;

  @Column()
  serverPlan: string;

  @Column()
  domainName: string;

  @Column()
  registrationDate: string;

  @Column()
  expiryDate: string;

  @Column()
  domainCost: string;

  @Column()
  customerName: string;

  @Column()
  paymentStatus: string;

  @Column({'nullable':true})
  paymentMethod: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
