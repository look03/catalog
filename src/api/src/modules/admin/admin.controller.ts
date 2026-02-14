import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UploadedFiles,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BaseProductDto } from './dto/base-product.dto';
import { BaseSectionDto } from './dto/base-section.dto';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { UpdateProductCommand } from './commands/impl/update-product.command';
import { DeleteProductCommand } from './commands/impl/delete-product.command';
import { CreateSectionCommand } from './commands/impl/create-section.command';
import { UpdateSectionCommand } from './commands/impl/update-section.command';
import { DeleteSectionCommand } from './commands/impl/delete-section.command';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UploadFiles } from '../../common/decorators/upload-files.decorator';
import { ReIndexSearchCommand } from './commands/impl/reindex-search.command';
import { GetProductsQuery } from './queries/impl/get-products.query';
import { GetSectionsQuery } from './queries/impl/get-sections.query';
import { GetBrandsQuery } from './queries/impl/get-brands.query';
import { GetModalSectionQuery } from './queries/impl/get-modal-sections.query';
import { BasePaginationFilterDto } from './dto/base-pagination-filter.query.dto';
import { Products } from './interfaces/product.interfaces';
import { Sections } from './interfaces/section.interfaces';
import { JwtGuard } from '../auth/infrastructure/jwt.guard';
import { RolesGuard } from '../auth/infrastructure/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BrandProduct } from './interfaces/brand.interface';
import { DecryptJwtGuard } from '../auth/infrastructure/decript.guard';

@Roles('admin')
@UseGuards(DecryptJwtGuard, JwtGuard, RolesGuard)
@ApiTags('admin')
@Controller('admin/')
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Создаёт секцию по title и parent_section_id, возвращает список секций.
   * @param dto — DTO с title и parent_section_id
   * @returns список секций
   */
  @Post('section/')
  @ApiOperation({ summary: 'Создать секцию' })
  async createSection(@Body() dto: BaseSectionDto): Promise<Sections> {
    await this.commandBus.execute(new CreateSectionCommand(dto.title, dto.parent_section_id));

    return this.queryBus.execute(new GetSectionsQuery(1, 10, undefined));
  }

  /**
   * Обновляет секцию по id (active, title, parent_section_id), возвращает список секций.
   * @param id — id секции
   * @param dto — DTO с полями для обновления
   * @returns список секций
   */
  @Patch('section/:id')
  @ApiOperation({ summary: 'Обновить секцию по id' })
  @ApiParam({ name: 'id', type: Number })
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BaseSectionDto,
  ): Promise<Sections> {
    await this.commandBus.execute(
      new UpdateSectionCommand(id, dto.active, dto.title, dto.parent_section_id),
    );

    return this.queryBus.execute(new GetSectionsQuery(1, 10, undefined));
  }

  /**
   * Удаляет секцию по id, возвращает список секций.
   * @param id — id секции
   * @returns список секций
   */
  @Delete('section/:id')
  @ApiOperation({ summary: 'Удалить секцию по id' })
  @ApiParam({ name: 'id', type: Number })
  async deleteSection(@Param('id', ParseIntPipe) id: number): Promise<Sections> {
    await this.commandBus.execute(new DeleteSectionCommand(id));

    return this.queryBus.execute(new GetSectionsQuery(1, 10, undefined));
  }

  /**
   * Возвращает список секций с пагинацией и фильтрами (name, sort, order).
   * @param query — параметры пагинации и сортировки
   * @returns список секций
   */
  @Get('sections/')
  async getSections(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: BasePaginationFilterDto,
  ): Promise<Products> {
    const { page, limit, name, sort, order } = query;
    return this.queryBus.execute(new GetSectionsQuery(page, limit, name, sort, order));
  }

  /**
   * Создаёт продукт с изображениями и привязкой к секциям и бренду, возвращает список продуктов.
   * @param dto — DTO продукта
   * @param images — загруженные изображения
   * @returns список продуктов
   */
  @Post('product/')
  @ApiOperation({ summary: 'Создать продукт' })
  @UploadFiles()
  async createProduct(
    @Body() dto: BaseProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Products> {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.title,
        dto.section_ids,
        dto.price,
        dto.color,
        dto.preview_text,
        dto.brand_id,
        images,
      ),
    );

    return this.queryBus.execute(new GetProductsQuery(1, 10, undefined));
  }

  /**
   * Обновляет продукт по id (включая изображения и секции), возвращает список продуктов.
   * @param id — id продукта
   * @param dto — DTO с полями для обновления
   * @param images — загруженные изображения
   * @returns список продуктов
   */
  @Patch('product/:id')
  @ApiOperation({ summary: 'Обновить продукт по id' })
  @ApiParam({ name: 'id', type: Number })
  @UploadFiles()
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Products> {
    await this.commandBus.execute(
      new UpdateProductCommand(
        id,
        dto.active,
        dto.title,
        dto.section_ids,
        dto.price,
        dto.color,
        dto.preview_text,
        dto.brand_id,
        images,
      ),
    );

    return this.queryBus.execute(new GetProductsQuery(1, 10, undefined));
  }

  /**
   * Удаляет продукт по id, возвращает список продуктов.
   * @param id — id продукта
   * @returns список продуктов
   */
  @Delete('product/:id')
  @ApiOperation({ summary: 'Удалить продукт по id' })
  @ApiParam({ name: 'id', type: Number })
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<Products> {
    await this.commandBus.execute(new DeleteProductCommand(id));

    return this.queryBus.execute(new GetProductsQuery(1, 10, undefined));
  }

  /**
   * Возвращает список продуктов с пагинацией и фильтрами (name, sort, order).
   * @param query — параметры пагинации и сортировки
   * @returns список продуктов
   */
  @Get('products/')
  async getProducts(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: BasePaginationFilterDto,
  ): Promise<Products> {
    const { page, limit, name, sort, order } = query;
    return this.queryBus.execute(new GetProductsQuery(page, limit, name, sort, order));
  }

  /**
   * Возвращает список брендов.
   * @returns список брендов (id, name)
   */
  @Get('brands/')
  async getBrands(): Promise<BrandProduct[] | null> {
    return this.queryBus.execute(new GetBrandsQuery());
  }

  /**
   * Возвращает секции для модального окна (например, выбор родителя).
   * @returns секции для модалки
   */
  @Get('modal-sections/')
  async getModalSection(): Promise<BrandProduct[] | null> {
    return this.queryBus.execute(new GetModalSectionQuery());
  }

  /**
   * Запускает переиндексацию Elasticsearch.
   * @returns результат выполнения команды
   */
  @Post('re-index/')
  @ApiOperation({ summary: 'Переиндексировать эластик' })
  reIndex() {
    return this.commandBus.execute(new ReIndexSearchCommand());
  }
}
