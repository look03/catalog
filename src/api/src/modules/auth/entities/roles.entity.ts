import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
