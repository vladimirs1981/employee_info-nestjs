import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CountryEntity } from '@app/country/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cities' })
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: true, example: 'New York' })
  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserEntity, user => user.city)
  users: UserEntity[];

  @ManyToOne(() => CountryEntity, country => country.cities)
  country: CountryEntity;
}
