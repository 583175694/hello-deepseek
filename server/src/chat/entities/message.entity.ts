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
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: string;

  @Column()
  role: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  reasoning: string;

  @Column('text', { nullable: true })
  searchContext: string;

  @Column('text', { nullable: true })
  sources: string;

  @Column('text', { nullable: true })
  tempFiles: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'sessionId', referencedColumnName: 'sessionId' })
  session: Session;

  @Column()
  sessionId: string;
}
