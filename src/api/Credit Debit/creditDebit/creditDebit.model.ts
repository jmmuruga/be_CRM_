import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class CreditDebit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiptId: string;

  @Column()
  Date: string;

  @Column()
  accountType: string;

  @Column()
  creditDebitType: string;

  @Column()
  Credit: string;

  @Column()
  Debit: string;

  @Column()
  paymentMethod: string;

  @Column()
  Details: string;

  @Column({ nullable: true })
  createdBy_userId: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  editedBy_userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
