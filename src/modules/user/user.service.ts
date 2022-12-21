import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addYears, subYears } from 'date-fns';
import { getFromToDate } from 'src/common/utils/date.helper';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IEditUser } from './interfaces/edit-user-admin.interface';
import { IGetUsersWithTotals } from './interfaces/get-users-with-totals.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsersWithTotals(
    fromDate?: Date,
    toDate?: Date,
    sort?: 'ASC' | 'DESC',
  ): Promise<IGetUsersWithTotals> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    const { from, to } = getFromToDate(fromDate, toDate);

    queryBuilder
      .leftJoin('user.schedules', 'schedules')
      .addSelect(
        `SUM(CASE WHEN schedules.date BETWEEN '${from.toISOString()}' AND '${to.toISOString()}' THEN schedules.hours ELSE 0 END)`,
        'totalHours',
      )
      .groupBy('user.id')
      .orderBy('totalHours', sort || 'DESC');
    const rawUsersWithTotalHours = await queryBuilder.getRawMany();
    const userEntities = await queryBuilder.getMany();
    const usersWithTotals = userEntities.map((user) => ({
      user: user,
      totalHours: parseInt(
        rawUsersWithTotalHours.find((rawUser) => rawUser.user_id === user.id)
          .totalHours,
      ),
    }));
    return { from, to, usersWithTotals };
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneById(userId: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: userId });
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

  async delete(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    this.usersRepository.remove(user);
  }

  async edit(userId: number, params: IEditUser) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    const { username, isActive, isAdmin } = params;
    if (username) {
      user.username = username;
    }
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
    return this.usersRepository.save(user);
  }
}
