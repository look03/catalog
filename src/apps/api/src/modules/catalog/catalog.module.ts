import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CatalogController } from './catalog.controller';
import { entities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

import { handlers } from './commands/handlers';
import { services } from './services';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(entities)],
  controllers: [CatalogController],
  providers: [...handlers, ...services],
  exports: services,
})
export class CatalogModule {}
