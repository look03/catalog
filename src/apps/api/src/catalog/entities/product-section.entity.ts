import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Product } from './product.entity';
import { Section } from './section.entity';

@Entity('product_sections')
@Unique(['product', 'section'])
export class ProductSection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productSections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Section, (section) => section.productSections, {
    onDelete: 'CASCADE',
    nullable: false, // Обязательное поле
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;
}
