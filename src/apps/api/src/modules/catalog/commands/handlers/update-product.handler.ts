import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../impl/update-product.command';
import { Product } from '../../entities/product.entity';
import { DataSource } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../services/product.service';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { assignIfDefined } from '../../../../common/utils/assing-if-defined.util';
import type { UpdatableProductFields } from '../../../../types/global.catalog';
import { UpdateImage } from '../../interfaces/product.interface';
import { ProductUpdatedEvent } from '../../events/product-updated.event';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const product = await manager.findOne(Product, {
          where: { id: command.id },
          relations: ['brand'],
        });

        if (!product) {
          throw new NotFoundException(`Product with id ${command.id} not found`);
        }

        if (command.title) {
          product.code = transliterate(command.title) as string;
        }

        assignIfDefined<
          UpdatableProductFields,
          readonly ('price' | 'color' | 'title' | 'preview_text')[]
        >(product, command, ['price', 'color', 'title', 'preview_text'] as const);

        if (command.section_ids?.length) {
          await this.productService.updateProductSections(product, command.section_ids, manager);
        }

        if (command.brand_id) {
          product.brand = await this.productService.getBrand(command.brand_id, manager);
        }

        if (command.active !== undefined) {
          product.active = command.active;
        }

        await manager.save(product);

        let imagesData: UpdateImage | null = null;
        if (command.images?.length) {
          imagesData = await this.productService.updateProductImages(
            product,
            manager,
            command.images,
          );
        }

        this.eventBus.publish(
          new ProductUpdatedEvent(
            {
              id: product.id,
              title: product.title,
              price: product.price,
            },
            imagesData?.newImages,
            imagesData?.oldFileDir,
          ),
        );
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
