import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSectionCommand } from './commands/create-section.command';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateProductCommand } from './commands/create-product.command';

@Controller('catalog/')
export class CatalogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('section/')
  createSection(@Body() dto: CreateSectionDto) {
    return this.commandBus.execute(new CreateSectionCommand(dto.title, dto.parent_section_id));
  }

  @Post('product/')
  createProduct(@Body() dto: CreateProductDto) {
    return this.commandBus.execute(
      new CreateProductCommand(
        dto.title,
        dto.section_id,
        dto.view_main_page,
        dto.slider_on_main_page,
        dto.price,
        dto.color,
        dto.preview_text,
      ),
    );
  }

  @Get()
  async findAll() {
    console.log(333333, '<<<<<<<3<<<<<<< 333333');
  }
}
