import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  ruc: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'enum', enum: ['USD', 'COP', 'MXN', 'NIO'], default: 'NIO' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  timezone: string;

  @Column({ type: 'enum', enum: ['12h', '24h'], default: '24h' })
  timeFormat: string;

  @Column({ type: 'varchar', default: 'dd/MM/yyyy' })
  dateFormat: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
