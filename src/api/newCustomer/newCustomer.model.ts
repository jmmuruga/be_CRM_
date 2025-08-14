import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class newCustomerRegistration {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  Email: string;

  @Column()
  Mobile: string;

  @Column({ 'nullable': true })
  alterMobile: string;

  @Column({ 'nullable': true })
  whatsappNumber: string;

  @Column()
  doorNumber: string;

  @Column()
  Street: string;

  @Column()
  landMark: string;

  @Column()
  Location: string;

  @Column()
  Post: string;

  @Column()
  Taluk: string;

  @Column()
  District: string;

  @Column()
  pinCode: string;

  @Column()
  companyName: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
