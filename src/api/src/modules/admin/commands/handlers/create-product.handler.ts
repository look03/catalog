import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../impl/create-product.command';
import { Product } from '../../entities/product.entity';
import { DataSource } from 'typeorm';
import { transliterate } from '../../../../common/utils/transliteration.util';
import { ProductService } from '../../services/product.service';
import { EventBus } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../../events/product-created.event';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateImage } from '../../interfaces/product.interfaces';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Создаёт продукт в транзакции: продукт, секции, изображения, бренд; публикует ProductCreatedEvent.
   * @param command — команда с данными продукта и изображениями
   * @returns id созданного продукта
   */
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
        const imagesData: UpdateImage | null = await this.productService.updateProductImages(
          product,
          manager,
          command.images,
        );

        this.eventBus.publish(new ProductCreatedEvent(imagesData?.newImages));

        return result.id;
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
