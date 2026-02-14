import { HashPathService } from './hash-path.service';
import { FileStorageService } from './file-storage.service';
import { Provider } from '@nestjs/common';
import { SyncMetaService } from './sync-meta.service';

export const services: Provider[] = [HashPathService, FileStorageService, SyncMetaService];
