import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  names: string;

  @Column()
  passwordHash: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: ['Administrador', 'Vendedor', 'Almacenista'], default: 'Vendedor' })
  role: string;

  @Column({ type: 'enum', enum: ['Activo', 'Inactivo'], default: 'Activo' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
