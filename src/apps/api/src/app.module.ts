import { Module } from '@nestjs/common';
import { CatalogModule } from './modules/catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    CatalogModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
  ],
})
export class AppModule {}
