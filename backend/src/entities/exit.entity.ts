import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { ExitItem } from './exit-item.entity';
import { Audit } from './audit.entity';

@Entity('exits')
export class Exit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  exitNumber: string;

  @Column()
  documentNumber: string;

  @Column({ type: 'date' })
  exitDate: Date;

  @ManyToOne(() => Client, client => client.exits, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'enum', enum: ['Pendiente', 'Completado', 'Cancelado'], default: 'Completado' })
  status: string;

  @OneToMany(() => ExitItem, exitItem => exitItem.exit, { cascade: true })
  items: ExitItem[];

  @OneToMany(() => Audit, audit => audit.exit)
  audits: Audit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
