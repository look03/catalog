import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductUpdatedEvent } from '../events/product-updated.event';
import { from, Observable } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';
import { FileStorageService } from '../../common/services/file-storage.service';
import { ProductIndexEvent } from '../interfaces/product.interfaces';

@Injectable()
export class ProductChangesSaga {
  constructor(private readonly fileStorage: FileStorageService) {}

  /**
   * Переносит файлы из temp в целевую директорию; при ошибке очищает temp.
   * @param event — событие с путями к изображениям и старой директорией
   * @returns Observable
   */
  private handleFilesAndIndex(event: ProductIndexEvent): Observable<void> {
    return from(this.fileStorage.moveFromTemp(event.images, event.oldFileDir)).pipe(
      catchError(async (error) => {
        await this.fileStorage.cleanupTemp(event.images);
        throw error;
      }),
    );
  }

  /**
   * Обрабатывает создание продукта: перенос загруженных изображений из temp.
   * @param events$ — поток событий ProductCreatedEvent
   * @returns Observable
   */
  @Saga()
  productCreated(events$: Observable<ProductCreatedEvent>): Observable<void> {
    return events$.pipe(
      ofType(ProductCreatedEvent),
      concatMap((event) => this.handleFilesAndIndex(event)),
    );
  }

  /**
   * Обрабатывает обновление продукта: перенос/очистка файлов изображений.
   * @param events$ — поток событий ProductUpdatedEvent
   * @returns Observable
   */
  @Saga()
  productUpdated(events$: Observable<ProductUpdatedEvent>): Observable<void> {
    return events$.pipe(
      ofType(ProductUpdatedEvent),
      concatMap((event) => this.handleFilesAndIndex(event)),
    );
  }
}
