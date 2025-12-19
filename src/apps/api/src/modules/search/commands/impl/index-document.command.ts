export class IndexDocumentCommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly price: number,
  ) {}
}
