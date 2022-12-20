import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  password: string;
}
