import { SearchProduct, SearchSection } from '../../../../types/global.catalog';

export class IndexDocumentCommand {
  constructor(public readonly document: SearchSection | SearchProduct) {}
}
