import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Section } from '../entities/section.entity';
import { Repository } from 'typeorm';
import {
  SearchSection,
  SearchSectionsAndProducts,
  SearchProduct,
} from '../../../types/global.catalog';

@Injectable()
export class IndexSearchService {
  constructor(
    @InjectRepository(Product)
    private readonly repoProduct: Repository<Product>,
    @InjectRepository(Section)
    private readonly repoSection: Repository<Section>,
  ) {}

  /**
   * Возвращает данные для индекса: секции и продукты (опционально отфильтрованные по updatedSince).
   * @param updatedSince — дата, после которой обновлены записи (опционально)
   * @returns секции и продукты в формате для Elasticsearch
   */
  async getIndexData(updatedSince?: Date): Promise<SearchSectionsAndProducts> {
    const sectionQuery = this.repoSection.createQueryBuilder('section');

    if (updatedSince) {
      sectionQuery.andWhere('section.updated_at > :updatedSince', { updatedSince });
    }

    const sections = await sectionQuery.getMany();

    const formatSections: SearchSection[] = sections.map((p) => ({
      id: p.id,
      active: p.active,
      title: p.title,
      code: p.code,
      parent_section_id: p.parent_section?.id,
      path: p.path,
      paths: [p.path],
      type: 'section',
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    const productQuery = this.repoProduct
      .createQueryBuilder('product')
      .leftJoin('product.images', 'images')
      .leftJoinAndSelect('product.productSections', 'productSections')
      .leftJoin('productSections.section', 'section')
      .leftJoin('product.brand', 'brand')
      .addSelect([
        'brand.code',
        'brand.name',
        'images.path',
        'section.id',
        'section.path',
        'section.title',
      ]);

    if (updatedSince) {
      productQuery.andWhere('product.updated_at > :updatedSince', { updatedSince });
    }

    const products = await productQuery.getMany();

    const formatProducts: SearchProduct[] = products.map((p) => {
      const paths = p.productSections
        .map((ps) => {
          return `${ps.section.path}${p.code}/`;
        })
        .filter((path): path is string => Boolean(path));

      const parentSectionsFormat = p.productSections.map((ps) => ({
        path: ps.section.path,
        name: ps.section.title,
      }));

      return {
        id: p.id,
        active: p.active,
        title: p.title,
        code: p.code,
        price: p.price,
        color: p.color,
        preview_text: p.preview_text,
        created_at: p.created_at,
        updated_at: p.updated_at,
        section_ids: p.productSections.map((ps) => ps.section.id),
        images: p.images.map((img) => img.path),
        brand: p.brand || undefined,
        paths,
        type: 'element',
        parent_sections_format: parentSectionsFormat,
      };
    });

    return {
      sections: formatSections || [],
      products: formatProducts || [],
    };
  }
}
