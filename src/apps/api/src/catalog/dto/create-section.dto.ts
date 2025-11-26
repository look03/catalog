import { IsNotEmpty, IsNumber, IsString, Length, IsOptional } from 'class-validator';
export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  title: string;

  @IsOptional()
  @IsNumber()
  parent_section_id?: number;
}
