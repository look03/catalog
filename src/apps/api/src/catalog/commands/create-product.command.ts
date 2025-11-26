export class CreateProductCommand {
  constructor(
    public readonly title: string,
    public readonly section_id: number,
    public readonly view_main_page: boolean,
    public readonly slider_on_main_page: boolean,
    public readonly price: number,
    public readonly color?: string,
    public readonly preview_text?: string,
  ) {}
}
