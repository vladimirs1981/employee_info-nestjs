import { Module } from '@nestjs/common';
import { CountryController } from '@app/country/country.controller';
import { CountryService } from '@app/country/country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '@app/country/country.entity';
import { CityEntity } from '@app/city/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, CityEntity])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
