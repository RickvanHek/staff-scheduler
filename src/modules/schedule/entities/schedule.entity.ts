import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  hours: number;

  @ManyToOne(() => User, (user) => user.schedules, { onDelete: 'CASCADE' })
  user: User;

  constructor(user: User, date: Date, hours: number) {
    this.date = date;
    this.hours = hours;
    this.user = user;
  }
}
