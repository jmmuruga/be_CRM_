import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class backupSetting {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  backupId: string;

  @Column()
  backupDrive: string;

  @Column({nullable: true})
  showBackup: boolean;

  @Column({nullable: true})
  Daily: boolean;

  @Column({nullable: true})
  Weekly: boolean;

  @Column({nullable: true})
  Monthly: boolean;

  @Column({nullable: true})
  dailyTime: string;

  @Column({nullable: true})
  weeklyDay: string;

  @Column({nullable: true})
  weeklyTime: string;

  @Column({nullable: true})
  monthlyDate: string;

  @Column({nullable: true})
  monthlyTime: string;

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
