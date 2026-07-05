import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { EntryItem } from './entry-item.entity';
import { Audit } from './audit.entity';

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  entryNumber: string;

  @Column()
  documentNumber: string;

  @Column({ type: 'date' })
  entryDate: Date;

  @ManyToOne(() => Supplier, supplier => supplier.entries, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column('uuid')
  supplierId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'enum', enum: ['Pendiente', 'Completado', 'Cancelado'], default: 'Completado' })
  status: string;

  @OneToMany(() => EntryItem, entryItem => entryItem.entry, { cascade: true })
  items: EntryItem[];

  @OneToMany(() => Audit, audit => audit.entry)
  audits: Audit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
