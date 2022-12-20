import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByUsername(username: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ username });
    const { password, ...result } = user;
    return result;
  }

  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // TODO: hash
    const user = new User(username, password);
    return this.usersRepository.save(user);
  }
}
