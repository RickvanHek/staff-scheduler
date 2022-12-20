import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './../auth/guards/admin.guard';
import { EditUserAdminBodyDto } from './dtos/edit-user-admin.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUser(@Param('id') userId: number) {
    return this.userService.findOneById(userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }

  @Patch(':id')
  editUser(@Param('id') userId: number, @Body() body: EditUserAdminBodyDto) {
    return this.userService.edit(userId, body);
  }
}
