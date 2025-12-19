import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CatalogController } from './catalog.controller';
import { entities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { handlers } from './commands/handlers';
import { services } from './services';
import { sagas } from './sagas';

@Module({
  imports: [CqrsModule, CommonModule, TypeOrmModule.forFeature(entities)],
  controllers: [CatalogController],
  providers: [...handlers, ...services, ...sagas],
  exports: services,
})
export class CatalogModule {}
