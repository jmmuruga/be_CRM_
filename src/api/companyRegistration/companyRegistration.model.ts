import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class companyRegistration {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  companyId: string;

  @Column()
  companyStartDate: string;

  @Column()
  companyName: string;

  @Column()
  doorNumber: string;

  @Column()
  buildingName: string;

  @Column()
  Street: string;

  @Column()
  Email: string;

  @Column()
  Location: string;

  @Column()
  pinCode: string;

  @Column()
  Post: string;

  @Column()
  Taluk: string;

  @Column()
  District: string;

  @Column()
  licenseNumber: string;

  @Column()
  licenseDate: string;

  @Column()
  Thasildhar: string;
  
  @Column()
  Website: string;

  @Column()
  ownerName: string;

  @Column()
  Mobile: string;

  @Column()
  officeNumber: string;

  @Column()
  Branch:string;

  @Column({ 'nullable': true })
  branchMobile: string;

  @Column({ type: "ntext", 'nullable': true })
  companyImage: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
