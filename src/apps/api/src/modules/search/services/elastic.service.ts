import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { getElasticAuth } from './elastic.config';

@Injectable()
export class ElasticService implements OnModuleInit {
  private client: Client;

  onModuleInit() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: getElasticAuth(),
    });
  }

  getClient(): Client {
    return this.client;
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
      console.log(error, '<<<<<<<<<<<<<< error');
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create elastic index',
        details: error,
      });
    }
  }

  async deleteIndex(index: string): Promise<void> {
    const exists = await this.client.indices.exists({ index });
    if (!exists) return;

    await this.client.indices.delete({ index });
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
}
