import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Наименование раздела',
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'Символьный код раздела',
  })
  code: string;

  @Column({
    type: 'varchar',
    comment: 'Путь к картинке раздела',
  })
  image: string;

  @Column({
    type: 'integer',
    comment: 'Привязка к родительскому разделу товара',
  })
  parent_section_id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Дата создания товара',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Дата последнего изменения товара',
  })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.section_id)
  products: Product[];
}
