import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './admin.controller';
import { entities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { CatalogModule } from '../catalog/catalog.module';
import { AuthModule } from '../auth/auth.module';
import { commandHandlers } from './commands/handlers';
import { queryHandlers } from './queries/handlers';
import { services } from './services';
import { sagas } from './sagas';
import { entitiesAuth } from '../auth/entities';

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    CatalogModule,
    AuthModule,
    TypeOrmModule.forFeature([...entities, ...entitiesAuth]),
  ],
  controllers: [AdminController],
  providers: [...commandHandlers, ...queryHandlers, ...services, ...sagas],
  exports: services,
})
export class AdminModule {}
