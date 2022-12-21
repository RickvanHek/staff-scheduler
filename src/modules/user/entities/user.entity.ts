import { Schedule } from 'src/modules/schedule/entities/schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
