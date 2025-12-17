import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSectionCommand } from './commands/impl/section/create-section.command';
import { CreateProductDto } from './dto/create-product.dto';
import { BaseSectionDto } from './dto/base-section.dto';
import { CreateProductCommand } from './commands/impl/product/create-product.command';
import { UpdateSectionCommand } from './commands/impl/section/update-section.command';
import { DeleteSectionCommand } from './commands/impl/section/delete-section.command';

@Controller('catalog/')
export class CatalogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('section/')
  createSection(@Body() dto: BaseSectionDto) {
    return this.commandBus.execute(new CreateSectionCommand(dto.title, dto.parent_section_id));
  }

  @Patch('section/:id')
  updateSection(@Param('id', ParseIntPipe) id: number, @Body() dto: BaseSectionDto) {
    return this.commandBus.execute(new UpdateSectionCommand(id, dto.title, dto.parent_section_id));
  }

  @Delete('section/:id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteSectionCommand(id));
  }

  @Post('product/')
  createProduct(@Body() dto: CreateProductDto) {
    return this.commandBus.execute(
      new CreateProductCommand(
        dto.title,
        dto.section_ids,
        dto.price,
        dto.color,
        dto.preview_text,
        dto.brand_id,
      ),
    );
  }

  @Get()
  async findAll() {
    console.log(333333, '<<<<<<<3<<<<<<< 333333');
  }
}
