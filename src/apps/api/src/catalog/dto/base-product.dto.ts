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

export class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Должен быть хотя бы один раздел' })
  @IsInt({ each: true, message: 'Каждый элемент должен быть числом' })
  section_ids: number[];

  @IsString()
  @IsOptional()
  @Length(7, 7)
  color?: string;

  @IsString()
  @IsOptional()
  @Length(2, 500)
  preview_text?: string;

  @IsOptional()
  @IsNumber()
  brand_id: number;
}
