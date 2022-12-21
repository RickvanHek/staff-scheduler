import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginBodyDto, LoginResponseDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login token',
    type: LoginResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Body() _: LoginBodyDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
