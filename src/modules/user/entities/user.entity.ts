import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  constructor(username: string, password: string, isAdmin: boolean = false) {
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}
