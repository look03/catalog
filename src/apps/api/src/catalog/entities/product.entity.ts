import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Section } from './section.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Наименование товара',
    unique: true,
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'Символьный код товара',
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    comment: 'Путь к картинке товара',
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'float',
    comment: 'Цена товара',
  })
  price: number;

  @Column({
    type: 'varchar',
    comment: 'Цвет товара (hex)',
    nullable: true,
  })
  color?: string;

  @Column({
    type: 'text',
    comment: 'Краткое описание товара',
    nullable: true,
  })
  preview_text?: string;

  @Column({
    type: 'integer',
    comment: 'Привязка к разделу товара',
  })
  section_id: number;

  @Column({
    type: 'boolean',
    comment: 'Признак отображения товара на главной странице',
  })
  view_main_page: boolean;

  @Column({
    type: 'boolean',
    comment: 'Признак отображения товара в слайдере на главной странице',
  })
  slider_on_main_page: boolean;

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

  @ManyToOne(() => Section, (section) => section.products, { onDelete: 'CASCADE' })
  section: Section;
}
