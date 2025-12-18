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

  async checkParentSection(
    parent_section_id: number | null | undefined,
  ): Promise<Section | undefined> {
    if (!parent_section_id) {
      return undefined;
    }

    const parentSection = await this.repo.findOneBy({ id: parent_section_id });
    if (!parentSection) {
      throw new NotFoundException(`Parent section with id ${parent_section_id} not found`);
    }

    return parentSection;
  }
}
