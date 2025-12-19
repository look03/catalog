// catalog/sagas/product-files-and-search.saga.ts
import { Injectable } from '@nestjs/common';
import { Saga, ofType, CommandBus } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductUpdatedEvent } from '../events/product-updated.event';
import { from, Observable } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import { FileStorageService } from '../../common/services/file-storage.service';
import { map } from 'rxjs';
import { ProductIndexEvent } from '../interfaces/product.interface';
import { IndexDocumentCommand } from '../../search/commands/impl/index-document.command';

@Injectable()
export class ProductChangesSaga {
  constructor(
    private readonly fileStorage: FileStorageService,
    private readonly commandBus: CommandBus,
  ) {}

  private handleFilesAndIndex(event: ProductIndexEvent): Observable<void> {
    if (!event.images || !event.images.length) {
      return from(
        this.commandBus.execute(
          new IndexDocumentCommand(event.product.id, event.product.title, event.product.price),
        ),
      )
        .pipe()
        .pipe(map(() => void 0));
    }

    return from(this.fileStorage.moveFromTemp(event.images, event.oldFileDir)).pipe(
      concatMap(() =>
        from(
          this.commandBus.execute(
            new IndexDocumentCommand(event.product.id, event.product.title, event.product.price),
          ),
        ),
      ),
      map(() => void 0),
      catchError(async (error) => {
        await this.fileStorage.cleanupTemp(event.images);
        throw error;
      }),
    );
  }

  @Saga()
  productCreated(events$: Observable<ProductCreatedEvent>): Observable<void> {
    return events$.pipe(
      ofType(ProductCreatedEvent),
      concatMap((event) => this.handleFilesAndIndex(event)),
    );
  }

  @Saga()
  productUpdated(events$: Observable<ProductUpdatedEvent>): Observable<void> {
    return events$.pipe(
      ofType(ProductUpdatedEvent),
      concatMap((event) => this.handleFilesAndIndex(event)),
    );
  }
}
