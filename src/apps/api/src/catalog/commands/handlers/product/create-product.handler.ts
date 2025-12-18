import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../impl/product/create-product.command';
import { Product } from '../../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { ProductService } from '../../../services/product.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
  ) {}

  async execute(command: CreateProductCommand) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const fields = {
          title: command.title,
          code: transliterate(command.title) ?? undefined,
          preview_text: command.preview_text ?? undefined,
          color: command.color ?? undefined,
          price: command.price,
        };

        const product = manager.create(Product, fields);
        product.brand = await this.productService.getBrand(command.brand_id, manager);
        const result = await manager.save(product);

        await this.productService.updateProductSections(product, command.section_ids, manager);

        return {
          product_id: result.id,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create product',
        details: error.message ?? error,
      });
    }
  }
}
