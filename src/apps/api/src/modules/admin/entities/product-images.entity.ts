import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: 'Наименование картинки',
  })
  filename: string;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({
    type: 'varchar',
    comment: 'Путь к картинке',
  })
  path: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Дата создания картинки',
  })
  created_at: Date;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
