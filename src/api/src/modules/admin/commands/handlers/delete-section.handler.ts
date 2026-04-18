import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSectionCommand } from '../impl/delete-section.command';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DeleteDocumentCommand } from '../../../catalog/commands/impl/delete-document.command';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';
import { SectionService } from '../../services/section.service';
import { Section } from '../../entities/section.entity';
import { Product } from '../../entities/product.entity';
import { ProductSection } from '../../entities/product-section.entity';
import { ProductImage } from '../../entities/product-images.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import { FileStorageService } from '../../../common/services/file-storage.service';
import path from 'path';

type IdRow = { id: string | number };

type DeleteSectionResult = {
  sectionIdsDeleted: number[];
  productIdsRemoved: number[];
  productImages: ProductImage[];
};

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionHandler implements ICommandHandler<DeleteSectionCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sectionService: SectionService,
    private readonly commandBus: CommandBus,
    private readonly fileStorage: FileStorageService,
  ) {}

  /**
   * Удаляет секцию, все дочерние секции и товары, которые после снятия связей не остаются ни в каком разделе.
   * Связи товаров только с удаляемым поддеревом удаляются вместе с товаром (БД + ES + файлы).
   */
  async execute(command: DeleteSectionCommand): Promise<void> {
    try {
      const result = await this.dataSource.transaction((manager: EntityManager) =>
        this.deleteSubtreeInTransaction(manager, command.id),
      );

      await this.removeElasticDocuments(result.sectionIdsDeleted, result.productIdsRemoved);
      await this.clearImagesDirectories(result.productImages);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete section',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  private async deleteSubtreeInTransaction(
    manager: EntityManager,
    rootSectionId: number,
  ): Promise<DeleteSectionResult> {
    await this.ensureSectionExists(manager, rootSectionId);

    const subtreeIds = await this.sectionService.getAllChildrenIds(manager, rootSectionId);
    const linkedProductIds = await this.findProductIdsLinkedToSubtree(manager, subtreeIds);

    await this.deleteProductSectionLinks(manager, subtreeIds);

    const productIdsToRemove = await this.findProductIdsWithNoSectionsLeft(
      manager,
      linkedProductIds,
    );
    const productImages =
      productIdsToRemove.length > 0
        ? await this.deleteProductsAndCollectImages(manager, productIdsToRemove)
        : [];

    await this.deleteSectionsBottomUp(manager, rootSectionId);

    return {
      sectionIdsDeleted: subtreeIds,
      productIdsRemoved: productIdsToRemove,
      productImages,
    };
  }

  private async ensureSectionExists(manager: EntityManager, sectionId: number): Promise<void> {
    const section = await manager.getRepository(Section).findOneBy({ id: sectionId });
    if (!section) {
      throw new NotFoundException(`Section with id ${sectionId} not found`);
    }
  }

  private async findProductIdsLinkedToSubtree(
    manager: EntityManager,
    subtreeIds: number[],
  ): Promise<number[]> {
    const raw: unknown = await manager.query(
      `SELECT DISTINCT ps.product_id AS id FROM product_sections ps WHERE ps.section_id = ANY($1::int[])`,
      [subtreeIds],
    );

    return (raw as IdRow[]).map((r) => Number(r.id));
  }

  private async deleteProductSectionLinks(
    manager: EntityManager,
    subtreeIds: number[],
  ): Promise<void> {
    await manager
      .createQueryBuilder()
      .delete()
      .from(ProductSection)
      .where('section_id IN (:...ids)', { ids: subtreeIds })
      .execute();
  }

  private async findProductIdsWithNoSectionsLeft(
    manager: EntityManager,
    linkedProductIds: number[],
  ): Promise<number[]> {
    if (linkedProductIds.length === 0) {
      return [];
    }

    const raw: unknown = await manager.query(
      `SELECT p.id AS id FROM products p
       WHERE p.id = ANY($1::int[])
       AND NOT EXISTS (SELECT 1 FROM product_sections ps WHERE ps.product_id = p.id)`,
      [linkedProductIds],
    );

    return (raw as IdRow[]).map((r) => Number(r.id));
  }

  private async deleteProductsAndCollectImages(
    manager: EntityManager,
    productIds: number[],
  ): Promise<ProductImage[]> {
    const images = await manager.find(ProductImage, {
      where: { productId: In(productIds) },
    });
    await manager.delete(Product, { id: In(productIds) });

    return images;
  }

  private async deleteSectionsBottomUp(
    manager: EntityManager,
    rootSectionId: number,
  ): Promise<void> {
    const orderedSectionIds = await this.sectionService.getSubtreeSectionIdsDepthDesc(
      manager,
      rootSectionId,
    );

    for (const sectionId of orderedSectionIds) {
      await manager.delete(Section, sectionId);
    }
  }

  private async removeElasticDocuments(sectionIds: number[], productIds: number[]): Promise<void> {
    for (const sectionId of sectionIds) {
      await this.commandBus.execute(new DeleteDocumentCommand(String(sectionId)));
    }
    for (const productId of productIds) {
      await this.commandBus.execute(new DeleteDocumentCommand(String(productId)));
    }
  }

  private async clearImagesDirectories(images: ProductImage[]): Promise<void> {
    const dirs = new Map<number, string>();
    for (const img of images) {
      if (!dirs.has(img.productId)) {
        dirs.set(img.productId, path.dirname(img.path));
      }
    }
    for (const dir of dirs.values()) {
      await this.fileStorage.clearDirectory(dir);
    }
  }
}
