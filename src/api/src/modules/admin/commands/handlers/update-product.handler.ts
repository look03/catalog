import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../impl/update-product.command';
import { Product } from '../../entities/product.entity';
import { DataSource } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../services/product.service';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { assignIfDefined } from '../../../../common/utils/assing-if-defined.util';
import type { UpdatableProductFields } from '../../../../types/global.catalog';
import { UpdateImage } from '../../interfaces/product.interfaces';
import { ProductUpdatedEvent } from '../../events/product-updated.event';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Обновляет продукт в транзакции (поля, секции, бренд, изображения); публикует ProductUpdatedEvent.
   * @param command — команда с id и полями для обновления
   */
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

        let removedPaths: string[] = [];
        if (command.image_ids_to_remove?.length) {
          removedPaths = await this.productService.removeProductImagesByIds(
            manager,
            product.id,
            command.image_ids_to_remove,
          );
        }

        let imagesData: UpdateImage | null = null;
        if (command.images?.length) {
          imagesData = await this.productService.addProductImages(product, manager, command.images);
        }

        this.eventBus.publish(
          new ProductUpdatedEvent(
            imagesData?.newImages,
            imagesData?.oldFileDir,
            removedPaths.length ? removedPaths : undefined,
          ),
        );
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update product',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
