import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Section } from '../entities/section.entity';
import { HashPathService } from '../../common/services/hash-path.service';
import { FileStorageService } from '../../common/services/file-storage.service';
import { Repository } from 'typeorm';

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

  async getReIndexData(): Promise<void> {
    const products = await this.repoProduct
      .createQueryBuilder('product')
      .leftJoin('product.images', 'images')
      .leftJoinAndSelect('product.productSections', 'productSections')
      .leftJoinAndSelect('productSections.section', 'section')
      .leftJoin('product.brand', 'brand') // делаем просто join без select
      .addSelect(['brand.code', 'brand.name', 'images.path'])
      .getMany();
    console.log(JSON.stringify(products, null, 2), '<<<<<<<<<<<<<< products');
    // const sections = await this.repoSection.find();
  }
}
