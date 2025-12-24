export class CreateSectionCommand {
  constructor(
    public readonly title: string,
    public readonly parent_section_id?: number,
  ) {}
}
