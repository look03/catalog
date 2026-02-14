import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../impl/delete-product.command';
import { Product } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DeleteDocumentCommand } from '../../../catalog/commands/impl/delete-document.command';
import { ProductImage } from '../../entities/product-images.entity';
import path from 'path';
import { FileStorageService } from '../../../common/services/file-storage.service';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly repoImages: Repository<ProductImage>,

    private readonly commandBus: CommandBus,
    private readonly fileStorage: FileStorageService,
  ) {}

  /**
   * Удаляет продукт из БД, документ из Elasticsearch и файлы изображений.
   * @param command — команда с id продукта
   */
  async execute(command: DeleteProductCommand) {
    try {
      const product = await this.repo.findOneBy({ id: command.id });
      if (!product) {
        throw new NotFoundException(`Product with id ${command.id} not found`);
      }

      const productImages = await this.repoImages.find({
        where: { productId: command.id },
      });

      let imagesDir: string | null = null;
      if (productImages?.length) {
        imagesDir = path.dirname(productImages[0].path);
      }

      await this.repo.remove(product);
      await this.commandBus.execute(new DeleteDocumentCommand(command.id.toString()));
      if (imagesDir) {
        await this.fileStorage.clearDirectory(imagesDir);
      }
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete section',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
