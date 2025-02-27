import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { KnowledgeDocument } from './knowledge-document.entity';

@Entity()
export class KnowledgeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  clientId: string;

  @Column({ default: 0 })
  documentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => KnowledgeDocument, (document) => document.knowledgeBase)
  documents: KnowledgeDocument[];
}
