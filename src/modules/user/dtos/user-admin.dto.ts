import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { UserResponseDto } from './user.dto';

export class UserAdminResponseDto extends UserResponseDto {
  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isAdmin: boolean;

  constructor(user: User) {
    const { isActive, isAdmin } = user;
    super(user);
    this.isActive = isActive;
    this.isAdmin = isAdmin;
  }
}
