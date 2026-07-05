import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Exit } from './exit.entity';
import { Product } from './product.entity';

@Entity('exit_items')
export class ExitItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exit, exit => exit.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exitId' })
  exit: Exit;

  @Column('uuid')
  exitId: string;

  @ManyToOne(() => Product, product => product.exitItems, { onDelete: 'RESTRICT' })
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
