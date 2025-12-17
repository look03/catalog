import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../impl/product/create-product.command';
import { Product } from '../../../entities/product.entity';
import { Section } from '../../../entities/section.entity';
import { Brand } from '../../../entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { transliterate } from '../../../../common/utils/transliteration.util';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async execute(command: CreateProductCommand) {
    try {
      const sections = await this.sectionRepository.find({
        where: {
          id: In(command.section_ids),
        },
      });

      let brandInfo: Brand | null = null;
      if (command.brand_id) {
        brandInfo = await this.brandRepository.findOneBy({
          id: command.brand_id,
        });
      }

      const fields = {
        title: command.title,
        code: transliterate(command.title) ?? undefined,
        preview_text: command.preview_text ?? undefined,
        color: command.color ?? undefined,
        price: command.price,
        brand: brandInfo ?? undefined,
        productSections: sections.map((section) => ({ section })),
      };

      const product = this.productRepository.create(fields);
      const result = await this.productRepository.save(product);

      return {
        id: result.id,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
