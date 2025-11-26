import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Наименование раздела',
    unique: true,
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'Символьный код раздела',
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    comment: 'Путь к картинке раздела',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'integer',
    comment: 'Привязка к родительскому разделу товара',
    nullable: true,
  })
  parent_section_id?: number;

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
