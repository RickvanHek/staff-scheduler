import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { intervalToDuration } from 'date-fns';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './../auth/guards/admin.guard';
import { EditUserAdminBodyDto } from './dtos/edit-user-admin.dto';
import { UserResponseDto } from './dtos/user-admin.dto';
import {
  ListUsersAccumulatedAdminQueryParamsDto,
  ListUsersAccumulatedResponseDto,
} from './dtos/list-users-admin.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/user')
@ApiTags('admin')
@ApiSecurity('bearer')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Users with total hours scheduled in given timeframe',
    type: ListUsersAccumulatedResponseDto,
  })
  @Get('accumulated')
  async listUsersAccumulatedByWork(
    @Query() query: ListUsersAccumulatedAdminQueryParamsDto,
  ): Promise<ListUsersAccumulatedResponseDto> {
    const { from, to, sort } = query;
    if (to && from && intervalToDuration({ start: from, end: to }).years >= 1) {
      throw new UnprocessableEntityException(`Maximum time frame is 1 year`);
    }
    return new ListUsersAccumulatedResponseDto(
      await this.userService.getUsersWithTotals(from, to, sort),
    );
  }

  @ApiOkResponse({
    description: 'The user',
    type: UserResponseDto,
  })
  @Get(':id')
  async getUser(@Param('id') userId: number): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.findOneById(userId));
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }

  @ApiOkResponse({
    description: 'The edited user',
    type: UserResponseDto,
  })
  @Patch(':id')
  async editUser(
    @Param('id') userId: number,
    @Body() body: EditUserAdminBodyDto,
  ): Promise<UserResponseDto> {
    return new UserResponseDto(await this.userService.edit(userId, body));
  }
}
