import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ProductSection } from './product-section.entity';

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
  @OneToMany(() => ProductSection, (ps) => ps.section)
  productSections: ProductSection[];

  @ManyToOne(() => Section, (section) => section.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_section_id' })
  parent_section?: Section;

  @OneToMany(() => Section, (section) => section.parent_section)
  children: Section[];
}
