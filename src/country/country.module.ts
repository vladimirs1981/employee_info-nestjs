import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { CityEntity } from '../city/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, CityEntity])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
