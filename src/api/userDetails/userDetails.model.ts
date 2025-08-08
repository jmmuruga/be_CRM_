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
  Email: string;

  @Column()
  userType: string;

  @Column()
  Mobile: string;

  @Column()
  Password: string;

  @Column()
  confirmPassword: string;
  
  @Column({default : true})
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
