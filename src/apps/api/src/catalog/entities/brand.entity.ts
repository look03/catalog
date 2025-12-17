import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Наименование бренда',
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: 'Символьный код бренда',
    unique: true,
  })
  code: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Дата добавления бренда',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Дата изменения бренда',
  })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
