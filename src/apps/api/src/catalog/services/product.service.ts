import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Brand } from '../entities/brand.entity';
import { Section } from '../entities/section.entity';
import { ProductSection } from '../entities/product-section.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repoProduct: Repository<Product>,

    @InjectRepository(Section)
    private readonly repoSection: Repository<Section>,

    @InjectRepository(ProductSection)
    private readonly repoProductSection: Repository<ProductSection>,

    @InjectRepository(Brand)
    private readonly repoBrand: Repository<Brand>,
  ) {}

  async getSections(
    sectionIds: number[],
    product: Product,
    manager: EntityManager,
  ): Promise<ProductSection[]> {
    const repoSection = manager ? manager.getRepository(Section) : this.repoSection;
    const sections = await repoSection.find({
      where: {
        id: In(sectionIds),
      },
    });

    const repoProductSection = manager
      ? manager.getRepository(ProductSection)
      : this.repoProductSection;

    return sections.map((section) => repoProductSection.create({ product, section }));
  }

  async updateProductSections(product: Product, newSectionIds: number[], manager: EntityManager) {
    try {
      await manager.delete(ProductSection, { product: { id: product.id } });

      if (!newSectionIds.length) {
        return;
      }

      const newRelations = await this.getSections(newSectionIds, product, manager);

      await manager.save(ProductSection, newRelations);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update product sections',
        details: error.message ?? error,
      });
    }
  }

  async getBrand(
    brandId: number | null | undefined,
    manager?: EntityManager,
  ): Promise<Brand | undefined> {
    if (!brandId) {
      return undefined;
    }

    const repo = manager ? manager.getRepository(Brand) : this.repoBrand;

    const brand = await repo.findOneBy({
      id: brandId,
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }

    return brand;
  }
}
