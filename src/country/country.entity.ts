import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity } from '@app/city/city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: true, example: 'USA' })
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @OneToMany(() => CityEntity, city => city.country)
  cities: CityEntity[];
}
