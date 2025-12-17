import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Image } from './images.entity';
import { Brand } from './brand.entity';
import { ProductSection } from './product-section.entity';

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

  // Связи
  @OneToMany(() => ProductSection, (section) => section.product, { cascade: true })
  productSections: ProductSection[];

  @OneToMany(() => Image, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: Image[];

  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand?: Brand;
}
