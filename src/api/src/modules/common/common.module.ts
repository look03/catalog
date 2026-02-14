import { Module } from '@nestjs/common';
import { services } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: services,
  exports: services,
})
export class CommonModule {}
