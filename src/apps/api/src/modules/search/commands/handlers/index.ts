import { DeleteDocumentHandler } from './delete-document.handler';
import { IndexDocumentHandler } from './index-document.handler';
import { ReIndexHandler } from './re-index.handler';

export const handlers = [DeleteDocumentHandler, IndexDocumentHandler, ReIndexHandler];
