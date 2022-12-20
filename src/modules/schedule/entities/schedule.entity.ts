import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  shiftLength: number;

  @ManyToOne(() => User, (user) => user.schedules)
  user: User;

  constructor(user: User, date: Date, shiftLength: number) {
    this.date = date;
    this.shiftLength = shiftLength;
    this.user = user;
  }
}
