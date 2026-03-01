import { IsNotEmpty, IsNumber, IsString, Length, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BaseSectionDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ example: 'Кружки', description: 'Название секции' })
  sectionName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: '1', description: 'Id родительской секции' })
  parentSectionId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: 'true', description: 'Активность' })
  active?: boolean;
}
