import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { GetBrandsQuery } from '../impl/get-brands.query';
import { Brand } from '../../entities/brand.entity';
import { BrandProduct } from '../../interfaces/brand.interface';

@QueryHandler(GetBrandsQuery)
export class GetBrandsHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  private readonly logger = new Logger('GetBrandsHandler');

  async execute(): Promise<BrandProduct[] | null> {
    try {
      const brands = await this.repo.find({
        select: {
          name: true,
          id: true,
        },
      });

      if (!brands) {
        return null;
      }

      return brands.map((el) => ({
        id: el.id,
        name: el.name,
      }));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get brands',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
