import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Section } from '../entities/section.entity';
import { HashPathService } from '../../common/services/hash-path.service';
import { FileStorageService } from '../../common/services/file-storage.service';
import { Repository } from 'typeorm';
import {
  SearchSection,
  SearchSectionsAndProducts,
  SearchProduct,
} from '../../../types/global.catalog';

@Injectable()
export class ReIndexSearchService {
  constructor(
    @InjectRepository(Product)
    private readonly repoProduct: Repository<Product>,
    @InjectRepository(Section)
    private readonly repoSection: Repository<Section>,

    private readonly hashPath: HashPathService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async getReIndexData(): Promise<SearchSectionsAndProducts | null> {
    const sections = await this.repoSection.createQueryBuilder('product').getMany();

    if (!sections.length) {
      return null;
    }

    const formatSections: SearchSection[] = sections.map((p) => ({
      id: p.id,
      title: p.title,
      code: p.code,
      parent_section_id: p.parent_section?.id,
      path: p.path,
      type: 'section',
    }));

    const products = await this.repoProduct
      .createQueryBuilder('product')
      .leftJoin('product.images', 'images')
      .leftJoinAndSelect('product.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .leftJoin('product.brand', 'brand')
      .addSelect(['brand.code', 'brand.name', 'images.path', 'section.id'])
      .getMany();

    if (!products.length) {
      return null;
    }

    const sectionMap = new Map<number, SearchSection>();

    formatSections.forEach((section) => {
      sectionMap.set(section.id, section);
    });
    const formatProducts: SearchProduct[] = products.map((p) => {
      const paths = p.productSections
        .map((ps) => {
          const sectionPath = sectionMap.get(ps.section.id)?.path;
          return sectionPath ? `${sectionPath}${p.code}/` : null;
        })
        .filter((path): path is string => Boolean(path));

      return {
        id: p.id,
        title: p.title,
        code: p.code,
        price: p.price,
        color: p.color,
        preview_text: p.preview_text,
        created_at: p.created_at,
        updated_at: p.updated_at,
        section_ids: p.productSections.map((p) => p.section.id),
        images: p.images.map((p) => p.path),
        brand: p.brand || undefined,
        brand_code: p.brand?.code || undefined,
        paths,
        type: 'element',
      };
    });

    return {
      sections: formatSections,
      products: formatProducts,
    };
  }
}
