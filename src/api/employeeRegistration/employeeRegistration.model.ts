import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class employeeRegistration {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  employeeName: string;

  @Column()
  employeeMobile: string;

  @Column()
  gender: string;

  @Column()
  joiningDate: string;

  @Column()
  designation: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
