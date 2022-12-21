import { User } from 'src/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserBodyDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}

export class RegisterUserResponseDto {
  @ApiProperty()
  id: number;

  constructor(user: User) {
    this.id = user.id;
  }
}
