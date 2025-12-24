import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformStringToNumberArray } from '../../../common/transforms/string-to-number-array.transformer';

export class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ example: 'Кружка', description: 'Название товара' })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '200', description: 'Цена товара' })
  @Transform(({ value }) => Number(value))
  price: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Должен быть хотя бы один раздел' })
  @IsInt({ each: true, message: 'Каждый элемент должен быть числом' })
  @ApiProperty({ example: '[1, 2]', description: 'Разделы товара' })
  @Transform(TransformStringToNumberArray())
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
  @Transform(({ value }) => Number(value))
  brand_id: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: 'true', description: 'Активность' })
  active?: boolean;
}
