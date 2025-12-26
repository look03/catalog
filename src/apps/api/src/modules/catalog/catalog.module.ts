import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CatalogController } from './catalog.controller';
import { entities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { SearchModule } from '../search/search.module';
import { AuthModule } from '../auth/auth.module';
import { commandHandlers } from './commands/handlers';
import { queryHandlers } from './queries/handlers';
import { services } from './services';
import { sagas } from './sagas';

@Module({
  imports: [CqrsModule, CommonModule, SearchModule, AuthModule, TypeOrmModule.forFeature(entities)],
  controllers: [CatalogController],
  providers: [...commandHandlers, ...queryHandlers, ...services, ...sagas],
  exports: services,
})
export class CatalogModule {}
