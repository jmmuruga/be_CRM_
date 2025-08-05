import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class domainRegistration {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  domainName: string;

  @Column()
  registrationDate: string;

  @Column()
  expiryDate: string;

  @Column()
  ssl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
