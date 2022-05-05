import { Module } from '@nestjs/common';
import { CityController } from '@app/city/city.controller';
import { CityService } from '@app/city/city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '@app/city/city.entity';
import { CountryEntity } from '@app/country/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, CountryEntity])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
