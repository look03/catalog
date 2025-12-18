import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../../impl/product/update-product.command';
import { Product } from '../../../entities/product.entity';
import { DataSource } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../../services/product.service';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
  ) {}

  async execute(command: UpdateProductCommand) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const product = await manager.findOne(Product, {
          where: { id: command.id },
          relations: ['brand'],
        });

        if (!product) {
          throw new NotFoundException(`Product with id ${command.id} not found`);
        }

        if (command.section_ids?.length) {
          await this.productService.updateProductSections(product, command.section_ids, manager);
        }

        if (command.brand_id) {
          product.brand = await this.productService.getBrand(command.brand_id, manager);
        }

        return manager.save(product);
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update product',
        details: error.message ?? error,
      });
    }
  }
}
