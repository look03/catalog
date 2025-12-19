export class UpdateSectionCommand {
  constructor(
    public readonly id: number,
    public readonly title?: string,
    public readonly parent_section_id?: number,
  ) {}
}
