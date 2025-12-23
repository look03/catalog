import { SearchSection, SearchProduct } from '../../../../types/global.catalog';

export class ReIndexCommand {
  constructor(
    public readonly products: SearchProduct[],
    public readonly sections: SearchSection[],
  ) {}
}
