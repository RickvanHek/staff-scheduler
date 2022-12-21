import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  RegisterUserBodyDto,
  RegisterUserResponseDto,
} from './dtos/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Users with total hours scheduled in given timeframe',
    type: RegisterUserResponseDto,
  })
  @Post('register')
  async registerUser(
    @Body() body: RegisterUserBodyDto,
  ): Promise<RegisterUserResponseDto> {
    const { username, password } = body;
    return new RegisterUserResponseDto(
      await this.userService.register(username, password),
    );
  }
}
