import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../impl/product/create-product.command';
import { Product } from '../../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { ProductService } from '../../../services/product.service';
import { ProductSection } from '../../../entities/product-section.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductSection)
    private readonly repoProductSection: Repository<ProductSection>,

    private readonly productService: ProductService,
  ) {}

  async execute(command: CreateProductCommand) {
    try {
      const fields = {
        title: command.title,
        code: transliterate(command.title) ?? undefined,
        preview_text: command.preview_text ?? undefined,
        color: command.color ?? undefined,
        price: command.price,
      };

      const product = this.productRepository.create(fields);
      product.brand = await this.productService.getBrand(command.brand_id);
      const result = await this.productRepository.save(product);

      // TODO: попробовать переписать
      const productSections = await this.productService.getSections(command.section_ids, result);
      await this.repoProductSection.save(productSections);

      return {
        product_id: result.id,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
