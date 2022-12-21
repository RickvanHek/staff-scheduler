import { User } from '../entities/user.entity';

export interface IUserWithTotalHours {
  user: User;
  totalHours: number;
}

export interface IGetUsersWithTotals {
  from: Date;
  to: Date;
  usersWithTotals: IUserWithTotalHours[];
}
