import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { UserService } from './../../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService = {
    findOneByUsername: () => new User('test@test.com', 'password'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'somesecret' })],
      providers: [AuthService, UserService],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    const result = await service.validateUser('test@test.com', 'password');
    expect(result.username).toBe('test@test.com');
  });

  it('should not validate user if we pass incorrect credentials', async () => {
    const result = await service.validateUser('test@test.com', 'wrongpassword');
    expect(result).toBe(null);
  });

  it('should login user after validating', async () => {
    const validatedUser = await service.validateUser(
      'test@test.com',
      'password',
    );
    const result = await service.login(validatedUser);
    expect(result.access_token).toBeDefined();
  });
});
