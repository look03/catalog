import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { handlers } from './commands/handlers';
import { services } from './services';
import { SearchController } from './search.controller';
import { workers } from './workers';
import { CommonModule } from '../common/common.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CqrsModule, CommonModule, ScheduleModule.forRoot()],
  controllers: [SearchController],
  providers: [...handlers, ...services, ...workers],
  exports: [...services, ...workers],
})
export class SearchModule {}
