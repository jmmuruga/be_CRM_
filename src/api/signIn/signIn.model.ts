import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class signInDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userName: string;

   @Column()
  Password: string;



}
