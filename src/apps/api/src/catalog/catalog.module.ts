import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [CqrsModule],
  controllers: [CatalogController],
  providers: [],
})
export class CatalogModule {}
