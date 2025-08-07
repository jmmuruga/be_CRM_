import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class companyRegistration {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  companyNameId: string;

  @Column()
  companyName: string;

  @Column()
  Mobile: string;

  @Column()
  companyStart: string;

  @Column()
  Location: string;

  @Column()
  licenseNumber: string;

  @Column()
  branchLocation: string;

  @Column()
  ownerName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
