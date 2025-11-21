import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BankAccountCreation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  bankAccNumberCreationId: string;

  @Column()
  accountHolderName: string;

  @Column()
  bankAccountNumber: string;

  @Column()
  confirmBankAccountNumber: string;

  @Column()
  Bank: string;

  @Column()
  Branch: string;

  @Column()
  ifscCode: string;

  @Column()
  accountType: string;

  @Column()
  authorizedPersonName: string;

  @Column()
  registeredMobileNumber: string;

  @Column()
  openingBalanceAmount: string;

  @Column()
  asOnDate: string;

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
