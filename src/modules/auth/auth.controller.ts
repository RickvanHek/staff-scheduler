import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() _: LoginBodyDto) {
    return this.authService.login(req.user);
  }
}
