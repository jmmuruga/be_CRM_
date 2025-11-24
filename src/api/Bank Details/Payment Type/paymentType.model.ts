import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UpiType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  paymentTypeId: string;

  @Column()
  companyId: string;

  @Column()
  paymentTypeName: string;

  @Column()
  Mobile: string;

  @Column()
  linkedAccountNumber: string;

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
