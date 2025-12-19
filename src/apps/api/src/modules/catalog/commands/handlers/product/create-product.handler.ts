import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../impl/product/create-product.command';
import { Product } from '../../../entities/product.entity';
import { DataSource } from 'typeorm';
import { transliterate } from '../../../../../common/utils/transliteration.util';
import { ProductService } from '../../../services/product.service';
import { EventBus } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../../../events/product-created.event';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateFiles } from '../../../../../types/global.catalog';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand) {
    try {
      return await this.dataSource.transaction(async (manager): Promise<number> => {
        const fields = {
          title: command.title,
          code: transliterate(command.title) ?? undefined,
          preview_text: command.preview_text ?? undefined,
          color: command.color ?? undefined,
          price: command.price,
        };

        const product: Product = manager.create(Product, fields);
        product.brand = await this.productService.getBrand(command.brand_id, manager);

        const result: Product = await manager.save(product);

        await this.productService.updateProductSections(product, command.section_ids, manager);
        const pathImages: UpdateFiles[] | null = await this.productService.updateProductImages(
          product,
          manager,
          command.images,
        );
        console.log(pathImages, '<<<<<<<<<<<<<< pathImages');

        this.eventBus.publish(
          new ProductCreatedEvent(
            {
              id: product.id,
              title: product.title,
              price: product.price,
            },
            pathImages,
          ),
        );

        return result.id;
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error.message ?? 'Failed to update product',
        details: error.details ?? error.message ?? error,
      });
    }
  }
}
