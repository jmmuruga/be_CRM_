import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class userDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userName: string;

  @Column()
  userId: string;

  @Column()
  companyName: string;

  @Column()
  Email: string;

  @Column()
  userType: string;

  @Column()
  Mobile: string;

  @Column()
  Password: string;

  @Column()
  confirmPassword: string;

  @Column({ default: true })
  status: boolean;

  @Column({default : '1'})
  companyId : string;

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
