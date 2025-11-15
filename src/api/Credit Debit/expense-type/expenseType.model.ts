import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ExpenseType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  expenseTypeId: string;

  @Column()
  expenseTypeName: string;

  @Column({ default: true })
  status: boolean;

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
