import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { handlers } from './commands/handlers';
import { services } from './services';
import { SearchController } from './search.controller';

@Module({
  imports: [CqrsModule],
  controllers: [SearchController],
  providers: [...handlers, ...services],
  exports: services,
})
export class SearchModule {}
