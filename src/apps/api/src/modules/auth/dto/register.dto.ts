import { IsEmail, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: number[];
}
