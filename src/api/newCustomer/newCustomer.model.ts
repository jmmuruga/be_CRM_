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
  email: string;

  @Column()
  mobile: string;

  @Column()
  alterMobile: string;

  @Column()
  whatsappNumber: string;

  @Column()
  doorNumber: string;

  @Column()
  street: string;

  @Column()
  landMark: string;

  @Column()
  location: string;

  @Column()
  post: string;

  @Column()
  taluk: string;

  @Column()
  district: string;

  @Column()
  pincode: string;

  @Column()
  companyName: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
