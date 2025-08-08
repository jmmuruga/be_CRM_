import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class serverMaster {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  serviceProvider: string;

  @Column()
  serverPlan: string;

  @Column()
  domainName: string;

  @Column()
  emailAddress: string;

  @Column()
  userName: string;

  @Column()
  registrationDate: string;

  @Column()
  expiryDate: string;

    @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
