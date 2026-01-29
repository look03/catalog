import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Brand } from '../entities/brand.entity';
import { Section } from '../entities/section.entity';
import { ProductSection } from '../entities/product-section.entity';
import { ProductImage } from '../entities/product-images.entity';
import { HashPathService } from '../../common/services/hash-path.service';
import { FileStorageService } from '../../common/services/file-storage.service';
import * as path from 'path';
import { UpdateImage } from '../interfaces/product.interfaces';
import { getDetailsErrorUtil } from '../../../common/utils/error.utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repoProduct: Repository<Product>,

    @InjectRepository(Section)
    private readonly repoSection: Repository<Section>,

    @InjectRepository(ProductSection)
    private readonly repoProductSection: Repository<ProductSection>,

    @InjectRepository(Brand)
    private readonly repoBrand: Repository<Brand>,
    private readonly hashPath: HashPathService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Возвращает относительный путь каталога для изображений продукта (по хешу id).
   * @param productId — id продукта
   * @returns путь к директории изображений
   */
  getRelativeTargetDir(productId: number): string {
    const hashedDir = this.hashPath.getHashedPath(productId, 1);
    const dir = this.fileStorageService.getUploadRoot();
    return path.join(dir, 'images', hashedDir);
  }

  /**
   * Обновляет изображения продукта: удаляет старые, сохраняет новые из files в БД и возвращает пути для копирования.
   * @param product — сущность продукта
   * @param manager — менеджер транзакции
   * @param files — загруженные файлы (опционально)
   * @returns данные для переноса файлов или null
   */
  async updateProductImages(
    product: Product,
    manager: EntityManager,
    files?: Express.Multer.File[],
  ): Promise<UpdateImage | null> {
    try {
      if (!files) {
        return null;
      }

      const oldProductFiles = await manager.find(ProductImage, {
        where: { productId: product.id },
      });

      let oldFileDir: string | null = null;
      if (oldProductFiles?.length) {
        oldFileDir = path.dirname(oldProductFiles[0].path);
        await manager.delete(ProductImage, { productId: product.id });
      }

      const relativeTargetDir = this.getRelativeTargetDir(product.id);
      const images = files.map((file) => {
        const fullPath = path.join(relativeTargetDir, file.originalname);
        return {
          entity: manager.create(ProductImage, {
            product,
            filename: file.originalname,
            path: fullPath,
          }),
          destPath: fullPath,
          name: file.originalname,
          tmpPath: file.path,
        };
      });

      await manager.save(
        ProductImage,
        images.map((i) => i.entity),
      );

      return {
        newImages: images.map((i) => ({
          destPath: i.destPath,
          name: i.name,
          tmpPath: i.tmpPath,
        })),
        oldFileDir: oldFileDir,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create images',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  /**
   * Находит секции по id и создаёт связи ProductSection для продукта (в транзакции при переданном manager).
   * @param sectionIds — массив id секций
   * @param product — сущность продукта
   * @param manager — менеджер транзакции (опционально)
   * @returns массив связей ProductSection
   */
  async getSections(
    sectionIds: number[],
    product: Product,
    manager: EntityManager,
  ): Promise<ProductSection[]> {
    const repoSection = manager ? manager.getRepository(Section) : this.repoSection;
    const sections = await repoSection.find({
      where: {
        id: In(sectionIds),
      },
    });

    const repoProductSection = manager
      ? manager.getRepository(ProductSection)
      : this.repoProductSection;

    return sections.map((section) => repoProductSection.create({ product, section }));
  }

  /**
   * Заменяет связи продукта с секциями на новые по newSectionIds (удаляет старые, сохраняет новые).
   * @param product — сущность продукта
   * @param newSectionIds — массив id новых секций
   * @param manager — менеджер транзакции
   */
  async updateProductSections(
    product: Product,
    newSectionIds: number[],
    manager: EntityManager,
  ): Promise<void> {
    try {
      await manager.delete(ProductSection, { product: { id: product.id } });

      if (!newSectionIds.length) {
        return;
      }

      const newRelations = await this.getSections(newSectionIds, product, manager);

      await manager.save(ProductSection, newRelations);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update product sections',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  /**
   * Находит бренд по id; при отсутствии бренда бросает NotFoundException.
   * @param brandId — id бренда (опционально)
   * @param manager — менеджер транзакции (опционально)
   * @returns сущность бренда или undefined
   */
  async getBrand(
    brandId: number | null | undefined,
    manager?: EntityManager,
  ): Promise<Brand | undefined> {
    if (!brandId) {
      return undefined;
    }

    const repo = manager ? manager.getRepository(Brand) : this.repoBrand;

    const brand = await repo.findOneBy({
      id: brandId,
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }

    return brand;
  }
}
