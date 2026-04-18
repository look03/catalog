import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetSectionTreeQuery } from '../impl/get-section-tree.query';
import { Section } from '../../../admin/entities/section.entity';

export type CatalogSectionTreeNode = {
  id: number;
  title: string;
  path: string;
  children: CatalogSectionTreeNode[];
};

type FlatNav = {
  id: number;
  title: string;
  path: string;
  parentSectionId: number | undefined;
};

function sectionPath(row: Section): string {
  const p = row.path?.trim();
  if (p) {
    return p;
  }
  return `/catalog/${row.code}/`;
}

@QueryHandler(GetSectionTreeQuery)
export class GetSectionTreeHandler implements IQueryHandler<GetSectionTreeQuery> {
  private readonly logger = new Logger(GetSectionTreeHandler.name);

  constructor(
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
  ) {}

  async execute(): Promise<CatalogSectionTreeNode[]> {
    try {
      const rows = await this.sectionRepo.find({
        where: { active: true },
        relations: ['parent_section'],
      });

      const flat: FlatNav[] = rows.map((s) => ({
        id: s.id,
        title: s.title,
        path: sectionPath(s),
        parentSectionId: s.parent_section?.id,
      }));

      const byId = new Map<number, CatalogSectionTreeNode>();
      for (const n of flat) {
        byId.set(n.id, {
          id: n.id,
          title: n.title,
          path: n.path,
          children: [],
        });
      }

      const roots: CatalogSectionTreeNode[] = [];
      for (const n of flat) {
        const node = byId.get(n.id)!;
        const pid = n.parentSectionId;
        if (pid !== undefined && byId.has(pid)) {
          byId.get(pid)!.children.push(node);
        } else {
          roots.push(node);
        }
      }

      const sortTree = (nodes: CatalogSectionTreeNode[]): void => {
        nodes.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        for (const node of nodes) {
          sortTree(node.children);
        }
      };
      sortTree(roots);

      return roots;
    } catch (error) {
      this.logger.warn(
        `Catalog section tree (DB): ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }
}
