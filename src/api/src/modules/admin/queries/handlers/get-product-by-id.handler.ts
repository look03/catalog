import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { Product } from '../../entities/product.entity';
import { GetProductByIdQuery } from '../impl/get-product-by-id.query';
import { EditProduct } from '../../interfaces/product.interfaces';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  private readonly logger = new Logger('GetProductByIdHandler');

  async execute(query: GetProductByIdQuery): Promise<EditProduct | null> {
    try {
      const product = await this.repo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.productSections', 'ps')
        .leftJoinAndSelect('ps.section', 's')
        .leftJoinAndSelect('p.images', 'img')
        .leftJoin('p.brand', 'b')
        .addSelect(['b.id'])
        .where('p.id = :id', { id: query.id })
        .getOne();

      if (!product) {
        return null;
      }

      const images = (product.images ?? []).map((img) => ({
        id: img.id,
        path: img.path.replace(/\\/g, '/'),
      }));

      return {
        title: product.title,
        price: product.price,
        section_ids: product.productSections.map((ps) => ps.section.id),
        color: product.color ?? undefined,
        preview_text: product.preview_text ?? undefined,
        brand_id: product.brand?.id,
        active: product.active,
        images,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get product by id',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
