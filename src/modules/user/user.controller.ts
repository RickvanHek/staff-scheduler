import { RegisterUserBodyDto } from './dtos/register-user.dto';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  registerUser(@Body() body: RegisterUserBodyDto) {
    const { username, password } = body;
    return this.userService.register(username, password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.findOneByUsername(req.user.username);
  }
}
