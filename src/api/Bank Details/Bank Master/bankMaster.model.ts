import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BankMaster {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  bankNameId: string;

  @Column()
  bankFullName: string;

  @Column()
  bankShortName: string;

  @Column()
  branchLocation: string;

  @Column()
  ifscCode: string;

  @Column()
  branchPhone: string;

  @Column()
  branchManagerName: string;

  @Column()
  branchManagerPhone: string;

  @Column()
  companyId: string;

  @Column()
  Address: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  createdBy_userId: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  editedBy_userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
