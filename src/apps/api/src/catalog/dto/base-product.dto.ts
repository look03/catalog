import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ example: 'Кружка', description: 'Название товара' })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '200', description: 'Цена товара' })
  price: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Должен быть хотя бы один раздел' })
  @IsInt({ each: true, message: 'Каждый элемент должен быть числом' })
  @ApiProperty({ example: '[1, 2]', description: 'Разделы товара' })
  section_ids: number[];

  @IsString()
  @IsOptional()
  @Length(7, 7)
  @ApiProperty({ example: '#FA8072', description: 'Цвет товара' })
  color?: string;

  @IsString()
  @IsOptional()
  @Length(2, 500)
  @ApiProperty({ example: 'Кружка для питья чая', description: 'Краткое описание' })
  preview_text?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: '1', description: 'Id бренда' })
  brand_id: number;
}
