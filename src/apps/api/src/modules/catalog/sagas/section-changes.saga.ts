import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { SectionChangesEvent } from '../events/section-changes.event';
import { Observable, from, of } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import { DeleteSectionCommand } from '../commands/impl/section/delete-section.command';
import { CommandBus } from '@nestjs/cqrs';
import { ElasticService } from '../../search/services/elastic.service';

@Injectable()
export class SectionChangesSaga {
  private readonly logger = new Logger(SectionChangesSaga.name);

  constructor(
    private readonly elasticService: ElasticService,
    private readonly commandBus: CommandBus,
  ) {}

  @Saga()
  sectionCreated = (events$: Observable<any>): Observable<any> => {
    return events$.pipe(
      ofType(SectionChangesEvent),
      concatMap((event) =>
        from(this.elasticService.updateOrCreate(event.section.id.toString(), event.section)).pipe(
          concatMap(() => of()),
          catchError(async (error) => {
            this.logger.error(`Failed to index section ${event.section.id}: ${error.message}`);
            await this.commandBus.execute(new DeleteSectionCommand(event.section.id));
            return of();
          }),
        ),
      ),
    );
  };
}
