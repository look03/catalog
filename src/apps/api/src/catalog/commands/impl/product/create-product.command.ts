export class CreateProductCommand {
  constructor(
    public readonly title: string,
    public readonly section_ids: number[],
    public readonly price: number,
    public readonly color?: string,
    public readonly preview_text?: string,
    public readonly brand_id?: number,
  ) {}
}
