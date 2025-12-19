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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BaseProductDto } from './dto/base-product.dto';
import { BaseSectionDto } from './dto/base-section.dto';
import { CreateProductCommand } from './commands/impl/product/create-product.command';
import { UpdateProductCommand } from './commands/impl/product/update-product.command';
import { DeleteProductCommand } from './commands/impl/product/delete-product.command';
import { CreateSectionCommand } from './commands/impl/section/create-section.command';
import { UpdateSectionCommand } from './commands/impl/section/update-section.command';
import { DeleteSectionCommand } from './commands/impl/section/delete-section.command';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UploadFiles } from '../../common/decorators/upload-files.decorator';
import { ReIndexSearchCommand } from './commands/impl/reindex-search.command';

@ApiTags('catalog')
@Controller('catalog/')
export class CatalogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('section/')
  @ApiOperation({ summary: 'Создать секцию' })
  createSection(@Body() dto: BaseSectionDto) {
    return this.commandBus.execute(new CreateSectionCommand(dto.title, dto.parent_section_id));
  }

  @Patch('section/:id')
  @ApiOperation({ summary: 'Обновить секцию по id' })
  @ApiParam({ name: 'id', type: Number })
  updateSection(@Param('id', ParseIntPipe) id: number, @Body() dto: BaseSectionDto) {
    return this.commandBus.execute(new UpdateSectionCommand(id, dto.title, dto.parent_section_id));
  }

  @Delete('section/:id')
  @ApiOperation({ summary: 'Удалить секцию по id' })
  @ApiParam({ name: 'id', type: Number })
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteSectionCommand(id));
  }

  @Post('product/')
  @ApiOperation({ summary: 'Создать продукт' })
  @UploadFiles()
  createProduct(@Body() dto: BaseProductDto, @UploadedFiles() images: Express.Multer.File[]) {
    return this.commandBus.execute(
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
  }

  @Patch('product/:id')
  @ApiOperation({ summary: 'Обновить продукт по id' })
  @ApiParam({ name: 'id', type: Number })
  @UploadFiles()
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.commandBus.execute(
      new UpdateProductCommand(
        id,
        dto.title,
        dto.section_ids,
        dto.price,
        dto.color,
        dto.preview_text,
        dto.brand_id,
        images,
      ),
    );
  }

  @Delete('product/:id')
  @ApiOperation({ summary: 'Удалить продукт по id' })
  @ApiParam({ name: 'id', type: Number })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }

  @Get()
  findAll() {
    console.log(333333, '<<<<<<<3<<<<<<< 333333');
  }

  @Post('re-index/')
  @ApiOperation({ summary: 'Переиндексировать эластик' })
  reIndex() {
    return this.commandBus.execute(new ReIndexSearchCommand());
  }
}
