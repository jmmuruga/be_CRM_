import {Column,CreateDateColumn,Entity,PrimaryGeneratedColumn, UpdateDateColumn,} from "typeorm";

@Entity()
export class forgetPasswordOtpStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  otp: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
