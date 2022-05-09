import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity } from '@app/city/city.entity';
import { UserEntity } from '@app/user/user.entity';

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CityEntity, city => city.country)
  cities: CityEntity[];
}
