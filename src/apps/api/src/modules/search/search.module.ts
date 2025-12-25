import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './commands/handlers';
import { services } from './services';
import { SearchController } from './search.controller';
import { workers } from './workers';
import { CommonModule } from '../common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { queryHandlers } from './queries/handlers';

@Module({
  imports: [CqrsModule, CommonModule, ScheduleModule.forRoot()],
  controllers: [SearchController],
  providers: [...commandHandlers, ...queryHandlers, ...services, ...workers],
  exports: [...services, ...workers],
})
export class SearchModule {}
