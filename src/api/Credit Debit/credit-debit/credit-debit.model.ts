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
  id: string;

  @Column()
  creditDebitId: string;

  @Column()
  creditDebitName: string;

  @Column({ nullable: true })
  Mobile: string;

  @Column({ nullable: true })
  Remarks: string;

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
