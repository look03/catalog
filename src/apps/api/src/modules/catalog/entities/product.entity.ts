import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { ProductSection } from './product-section.entity';
import { ProductImage } from './product-images.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    comment: 'Активность товара',
    default: true,
  })
  active: boolean;

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

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand?: Brand;
}
