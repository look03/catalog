import { IsNotEmpty, IsNumber, IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  section_id: number;

  @IsString()
  @IsOptional()
  @Length(7, 7)
  color?: string;

  @IsString()
  @IsOptional()
  @Length(2, 500)
  preview_text?: string;

  @IsOptional()
  @IsBoolean()
  view_main_page: boolean;

  @IsOptional()
  @IsBoolean()
  slider_on_main_page: boolean;
}
