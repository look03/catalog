import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../../impl/product/delete-product.command';
import { Product } from '../../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async execute(command: DeleteProductCommand) {
    try {
      const product = await this.repo.findOneBy({ id: command.id });
      if (!product) {
        throw new NotFoundException(`Product with id ${command.id} not found`);
      }

      await this.repo.remove(product);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete section',
        details: error.message ?? error,
      });
    }
  }
}
