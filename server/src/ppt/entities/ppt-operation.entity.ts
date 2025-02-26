import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum PPTOperationType {
  AUTH = 'auth',
  OUTLINE = 'outline',
  CONTENT = 'content',
}

@Entity('ppt_operations')
export class PPTOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pptId: string;

  @Column()
  clientId: string;

  @Column({
    type: 'enum',
    enum: PPTOperationType,
  })
  type: PPTOperationType;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  outline?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  authCode?: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  ensurePptId() {
    if (!this.pptId) {
      this.pptId = uuidv4();
    }
  }
}
