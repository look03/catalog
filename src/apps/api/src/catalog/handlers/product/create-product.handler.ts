import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../commands/create-product.command';
import { Product } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../common/utils/transliteration.util';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async execute(command: CreateProductCommand) {
    try {
      const fields = {
        title: command.title,
        section_id: command.section_id ?? undefined,
        code: transliterate(command.title) ?? undefined,
        preview_text: command.preview_text ?? undefined,
        color: command.color ?? undefined,
        price: command.price,
        view_main_page: command.view_main_page ?? false,
        slider_on_main_page: command.slider_on_main_page ?? false,
        image: undefined,
      };

      const product = this.repo.create(fields);
      const result = await this.repo.save(product);

      return result.id;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
