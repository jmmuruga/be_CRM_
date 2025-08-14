import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class employeeRegistration {
  @PrimaryGeneratedColumn()
  id: string;

    @Column()
  employeeId: string;

  @Column()
  employeeName: string;

    @Column()
  bloodGroup: string;

  @Column()
  employeeMobile: string;

  @Column()
  Gender: string;

  @Column()
  employeeEmail: string;

    @Column()
  gurardianType: string;

    @Column()
  guardianName: string;

    @Column()
  guardianMobile: string;

    @Column()
  Dob: string;

  @Column()
  joiningDate: string;

  @Column()
  resignedDate: string;

  @Column()
  Designation: string;

   @Column()
  employeeAddress: string;

  @Column()
  monthlySalary: string;

  @Column()
  workStatus: string;

  @Column({ type: "ntext", nullable: true })
  employeeImage: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
