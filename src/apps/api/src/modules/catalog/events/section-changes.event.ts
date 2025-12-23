import { SearchSection } from '../../../types/global.catalog';

export class SectionChangesEvent {
  constructor(public readonly section: SearchSection) {}
}
