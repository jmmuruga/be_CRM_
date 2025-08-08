import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class hostingMaster {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  customerName: string;

  @Column()
  server: string;

  @Column()
  domainName: string;

  @Column()
  hostingName: string;

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
