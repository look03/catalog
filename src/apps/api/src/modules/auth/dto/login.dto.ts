import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@mai.ru', description: 'email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '23121dqwe', description: 'password' })
  password: string;
}
