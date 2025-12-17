import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../../impl/product/update-product.command';
import { Product } from '../../../entities/product.entity';
import { Section } from '../../../entities/section.entity';
import { Brand } from '../../../entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../../services/product.service';
import { ProductSection } from '../../../entities/product-section.entity';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductSection)
    private readonly repoProductSection: Repository<ProductSection>,

    private readonly productService: ProductService,
  ) {}

  async execute(command: UpdateProductCommand) {
    try {
      const product = await this.productRepository.findOneBy({ id: command.id });
      if (!product) {
        throw new NotFoundException(`Product with id ${command.id} not found`);
      }

      if (command.section_ids) {
        await this.repoProductSection.delete({ product: { id: product.id } });
        product.productSections = await this.productService.getSections(
          command.section_ids,
          product,
        );
      }

      if (command.brand_id) {
        product.brand = await this.productService.getBrand(command.brand_id);
      }

      await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create section',
        details: error.message ?? error,
      });
    }
  }
}
