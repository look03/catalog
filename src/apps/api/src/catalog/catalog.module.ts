import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CatalogController } from './catalog.controller';
import { Product } from './entities/product.entity';
import { Section } from './entities/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSectionHandler, CreateProductHandler } from './handlers/';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Product, Section])],
  controllers: [CatalogController],
  providers: [CreateSectionHandler, CreateProductHandler],
})
export class CatalogModule {}
