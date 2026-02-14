import { IsEmail, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@mail.ru', description: 'Почта' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '1234выф', description: 'Пароль' })
  password: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ example: '[1]', description: 'Идентификаторы ролей 1 - admin, 2 - user' })
  roles?: number[];
}
