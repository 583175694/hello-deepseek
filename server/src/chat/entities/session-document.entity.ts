import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity()
export class SessionDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('text')
  metadata: string;

  @Column('simple-array')
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'sessionId', referencedColumnName: 'sessionId' })
  session: Session;

  @Column()
  sessionId: string;
}
