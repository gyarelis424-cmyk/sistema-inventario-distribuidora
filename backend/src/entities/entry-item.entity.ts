import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Entry } from './entry.entity';
import { Product } from './product.entity';

@Entity('entry_items')
export class EntryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Entry, entry => entry.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entryId' })
  entry: Entry;

  @Column('uuid')
  entryId: string;

  @ManyToOne(() => Product, product => product.entryItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('uuid')
  productId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @CreateDateColumn()
  createdAt: Date;
}
