import { HashPathService } from './hash-path.service';
import { FileStorageService } from './file-storage.service';
import { Provider } from '@nestjs/common';

export const services: Provider[] = [HashPathService, FileStorageService];
