import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Entry } from './entry.entity';
import { Exit } from './exit.entity';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  userId: string;

  @ManyToOne(() => Entry, entry => entry.audits, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'entryId' })
  entry: Entry;

  @Column('uuid', { nullable: true })
  entryId: string;

  @ManyToOne(() => Exit, exit => exit.audits, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'exitId' })
  exit: Exit;

  @Column('uuid', { nullable: true })
  exitId: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: any;

  @CreateDateColumn()
  createdAt: Date;
}
