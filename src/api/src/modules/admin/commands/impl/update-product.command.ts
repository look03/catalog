export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly active?: boolean,
    public readonly title?: string,
    public readonly section_ids?: number[],
    public readonly price?: number,
    public readonly color?: string,
    public readonly preview_text?: string,
    public readonly brand_id?: number,
    public readonly images?: Express.Multer.File[],
    public readonly image_ids_to_remove?: number[],
  ) {}
}
