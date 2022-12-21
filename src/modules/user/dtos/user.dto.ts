import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  constructor(user: User) {
    const { id, isActive, isAdmin, username } = user;
    this.id = id;
    this.username = username;
  }
}
