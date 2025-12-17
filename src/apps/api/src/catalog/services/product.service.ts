import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async getSections(sectionIds: number[], product: Product): Promise<ProductSection[]> {
    const sections = await this.repoSection.find({
      where: {
        id: In(sectionIds),
      },
    });

    return sections.map((section) => this.repoProductSection.create({ product, section }));
  }

  async getBrand(brandId: number | null | undefined): Promise<Brand | undefined> {
    if (!brandId) {
      return undefined;
    }

    const brand = await this.repoBrand.findOneBy({
      id: brandId,
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }

    return brand;
  }
}
