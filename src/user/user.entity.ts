import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '@app/user/types/userRole.enum';
import { CityEntity } from '@app/city/city.entity';
import { UserSeniority } from './types/userSeniority.enum';
import { CountryEntity } from '../country/country.entity';
import { TechnologyEntity } from '../technology/technology.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  googleId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserSeniority,
    default: UserSeniority.JUNIOR,
  })
  seniority: UserSeniority;

  @Column({ default: '' })
  plan: string;

  @ManyToOne(() => CityEntity, city => city.users)
  city: CityEntity;

  @ManyToMany(() => TechnologyEntity)
  @JoinTable()
  technologies: TechnologyEntity[];
}
