import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KnowledgeBase } from './knowledge-base.entity';

@Entity()
export class KnowledgeDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalFilename: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column()
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => KnowledgeBase, (base) => base.documents)
  @JoinColumn({ name: 'knowledgeBaseId' })
  knowledgeBase: KnowledgeBase;

  @Column()
  knowledgeBaseId: string;
}
