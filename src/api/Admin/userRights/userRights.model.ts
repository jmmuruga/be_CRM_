import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class userRights {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userTypeId: string;

  @Column()
  companyId: string;

  @Column()
  formCode: string;

  @Column()
  parentId: string;
  
  @Column()
  formName: string;

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
