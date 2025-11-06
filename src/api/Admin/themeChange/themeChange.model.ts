import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class customizeTheme {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  companyId: string;

  @Column()
  userId: string;

  @Column()
  themeColor: string;

  @Column()
  tableHeaderColor: string;

  @Column()
  tableHeaderTextColor: string;

  @Column({ default: false })
  isEdited: boolean;

    @Column({ nullable: true })
  editedBy_userId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
