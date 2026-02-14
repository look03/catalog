import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'id', description: 'Идентификатор пользователя' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'token', description: 'refreshToken' })
  refreshToken: string;
}
