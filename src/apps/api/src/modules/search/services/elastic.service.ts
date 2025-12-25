import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { getElasticAuth } from './elastic.config';
import { ElasticSearchOptions, ElasticSearchResult } from '../types/elastic-search.types';

@Injectable()
export class ElasticService implements OnModuleInit {
  private client: Client;

  onModuleInit() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: getElasticAuth(),
    });
  }

  private async getIndex(): Promise<string | null> {
    try {
      const alias: string = process.env.ELASTIC_ALIAS || 'catalog_search';

      const aliasExists = await this.client.indices.existsAlias({ name: alias });
      if (!aliasExists) {
        return null;
      }

      const aliasInfo = await this.client.indices.getAlias({ name: alias });
      const indices = Object.keys(aliasInfo);

      return indices.length > 0 ? indices[0] : null;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to get index for alias',
        details: error,
      });
    }
  }

  async updateOrCreate(id: string, doc: Record<string, any>): Promise<void> {
    try {
      const index = await this.getIndex();
      if (!index) {
        throw new InternalServerErrorException('No such index');
      }

      await this.client.update({
        index,
        id,
        doc,
        doc_as_upsert: true,
        refresh: true,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to add index',
        details: error,
      });
    }
  }

  async createIndex(index: string, mapping: object): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index });

      if (exists) {
        return;
      }

      await this.client.indices.create({
        index,
        body: mapping,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create elastic index',
        details: error,
      });
    }
  }

  async deleteIndex(index: string): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index });
      if (!exists) {
        return;
      }

      await this.client.indices.delete({ index });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete index',
        details: error,
      });
    }
  }

  async bulk(index: string, documents: Array<Record<string, unknown>>): Promise<void> {
    try {
      const body = documents.flatMap((doc) => [{ index: { _index: index, _id: doc.id } }, doc]);

      await this.client.bulk({
        refresh: true,
        body,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Write goods in elastic',
        details: error,
      });
    }
  }

  async syncDocumentsBulk(documents: Array<Record<string, unknown>>): Promise<void> {
    try {
      const index = await this.getIndex();

      const activeDocs = documents.filter((doc) => doc.active !== false);
      const inactiveDocs = documents.filter((doc) => doc.active === false);

      const updateBody = activeDocs.flatMap((doc) => [
        { update: { _index: index, _id: doc.id } },
        { doc, doc_as_upsert: true },
      ]);

      const deleteBody = inactiveDocs.map((doc) => ({
        delete: { _index: index, _id: doc.id },
      }));

      const bulkBody = [...updateBody, ...deleteBody];

      if (bulkBody.length === 0) {
        return;
      }

      await this.client.bulk({
        refresh: true,
        body: bulkBody,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to bulk insert/delete documents',
        details: error,
      });
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const index = await this.getIndex();

      if (!index) {
        throw new InternalServerErrorException('No such index');
      }

      await this.client.delete({
        index,
        id,
        refresh: true,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete index',
        details: error,
      });
    }
  }

  async switchAlias(alias: string | undefined, newIndex: string): Promise<void> {
    if (!alias) {
      return;
    }

    const actions: any[] = [];
    const aliasExists = await this.client.indices.existsAlias({
      name: alias,
    });

    const currentIndexes: string[] = [];
    if (aliasExists) {
      const current = await this.client.indices.getAlias({ name: alias });

      Object.keys(current).forEach((index) => {
        currentIndexes.push(index);
        actions.push({
          remove: { index, alias },
        });
      });
    }

    actions.push({
      add: { index: newIndex, alias },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await (this.client.indices.updateAliases as any)({
      body: {
        actions,
      },
    });

    if (currentIndexes.length > 0) {
      for (const oldIndex of currentIndexes) {
        if (oldIndex !== newIndex) {
          try {
            await this.client.indices.delete({ index: oldIndex });
          } catch (error) {
            throw new InternalServerErrorException({
              success: false,
              message: `Delete elastic index ${oldIndex}`,
              details: error,
            });
          }
        }
      }
    }
  }
  async search<T = any>(options: ElasticSearchOptions): Promise<ElasticSearchResult<T>> {
    try {
      const index = await this.getIndex();
      if (!index) {
        throw new InternalServerErrorException('No such index');
      }

      const result = await this.client.search({
        index,
        from: options.from,
        size: options.size,
        query: options.query,
        sort: options.sort,
        aggs: options.aggs,
      });

      return result as ElasticSearchResult<T>;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Elastic search failed',
        details: error,
      });
    }
  }
}
