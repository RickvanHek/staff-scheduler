import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import {
  IGetUsersWithTotals,
  IUserWithTotalHours,
} from '../interfaces/get-users-with-totals.interface';

export class ListUsersAccumulatedAdminQueryParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: 'ASC' | 'DESC';
}

export class UserWithTotalHoursDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  hours: number;

  constructor(userWithTotal: IUserWithTotalHours) {
    const { user, totalHours } = userWithTotal;
    const { username, id, isActive, isAdmin } = user;
    this.username = username;
    this.id = id;
    this.isActive = isActive;
    this.isAdmin = isAdmin;
    this.hours = totalHours;
  }
}

export class ListUsersAccumulatedResponseDto {
  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;

  @ApiProperty({ isArray: true, type: UserWithTotalHoursDto })
  data: UserWithTotalHoursDto[];

  constructor(getUsersWithTotals: IGetUsersWithTotals) {
    const { from, to, usersWithTotals } = getUsersWithTotals;
    this.from = from;
    this.to = to;
    this.data = usersWithTotals.map((user) => new UserWithTotalHoursDto(user));
  }
}
