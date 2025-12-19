import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/section.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}
  async designParentSection(
    parentSectionId: number | undefined,
    code: string | undefined,
    section: Section,
  ): Promise<void> {
    if (!parentSectionId) {
      section.path = `/catalog/${code}/`;
      return;
    }

    const parentSection = await this.repo.findOneBy({ id: parentSectionId });
    if (!parentSection) {
      throw new NotFoundException(`Parent section with id ${parentSectionId} not found`);
    }

    section.parent_section = parentSection;
    if (code) {
      section.path = `${parentSection.path}${code}/`;
    }
  }
}
