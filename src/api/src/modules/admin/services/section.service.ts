import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Section } from '../entities/section.entity';
import { Product } from '../entities/product.entity';

type SectionIdRow = { id: string | number };

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
  ) {}

  /**
   * Устанавливает родительскую секцию и path для секции (path строится от родителя и code).
   * @param parentSectionId — id родительской секции (опционально)
   * @param code — код секции
   * @param section — сущность секции для заполнения
   */
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

  async getAllChildrenIds(manager: EntityManager, sectionId: number): Promise<number[]> {
    const raw: unknown = await manager.query(
      `
    WITH RECURSIVE tree AS (
      -- старт: текущая секция
      SELECT id
      FROM sections
      WHERE id = $1

      UNION ALL

      -- рекурсивно ищем детей
      SELECT s.id
      FROM sections s
      INNER JOIN tree t ON s.parent_section_id = t.id
    )
    SELECT id FROM tree
    `,
      [sectionId],
    );
    const rows = raw as SectionIdRow[];

    return rows.map((r) => Number(r.id));
  }

  /**
   * Каскад active только вниз от переданной секции (она сама + все потомки).
   * Родительские разделы не меняются.
   * Товары обновляются, если привязаны хотя бы к одной секции из этого поддерева.
   */
  async updateSectionActivityTree(
    manager: EntityManager,
    sectionId: number,
    isActive: boolean,
  ): Promise<void> {
    const subtreeSectionIds = await this.getAllChildrenIds(manager, sectionId);

    await manager
      .createQueryBuilder()
      .update(Section)
      .set({ active: isActive })
      .whereInIds(subtreeSectionIds)
      .execute();

    await manager
      .createQueryBuilder()
      .update(Product)
      .set({ active: isActive })
      .where(
        `
        id IN (
          SELECT ps.product_id
          FROM product_sections ps
          WHERE ps.section_id IN (:...ids)
        )
      `,
        { ids: subtreeSectionIds },
      )
      .execute();
  }
}
