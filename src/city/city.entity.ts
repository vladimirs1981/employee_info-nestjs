import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CountryEntity } from '@app/country/country.entity';

@Entity({ name: 'cities' })
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserEntity, user => user.city)
  users: UserEntity[];

  @ManyToOne(() => CountryEntity, country => country.cities, { eager: true })
  country: CountryEntity;
}
