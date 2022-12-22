import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  constructor(user: User) {
    const { id, username } = user;
    this.id = id;
    this.username = username;
  }
}
