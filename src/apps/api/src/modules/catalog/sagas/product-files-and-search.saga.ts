// catalog/sagas/product-files-and-search.saga.ts
import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../events/product-created.event';
import { from, Observable } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import { FileStorageService } from '../../common/services/file-storage.service';
import { of } from 'rxjs';

@Injectable()
export class ProductFilesAndSearchSaga {
  constructor(private readonly fileStorage: FileStorageService) {}

  @Saga()
  productCreated = (events$: Observable<ProductCreatedEvent>): Observable<void> =>
    events$.pipe(
      ofType(ProductCreatedEvent),
      concatMap((event: ProductCreatedEvent) => {
        return from(this.fileStorage.moveFromTemp(event.images)).pipe(
          concatMap(() => {
            console.log(2222222);
            return of(void 0); // явно возвращаем Observable<void>
          }),
          catchError(async (error) => {
            await this.fileStorage.cleanupTemp(event.images);
            throw error;
          }),
        );
      }),
    );
}
