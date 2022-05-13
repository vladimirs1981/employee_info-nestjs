import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CountryEntity } from './country.entity';
import { CreateCountryDto } from './dto/createCountry.dto';
import { CityEntity } from '../city/city.entity';
import { PostgresErrorCode } from '@app/database/postgresErrorCodes.enum';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    try {
      return await this.countryRepository.find({
        relations: ['cities'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findCountryById(id: number): Promise<CountryEntity> {
    try {
      const country = await this.countryRepository.findOne(id);
      if (!country) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }
      return country;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCountry(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    try {
      const country = new CountryEntity();
      Object.assign(country, createCountryDto);
      return this.countryRepository.save(country);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Country with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCountry(countryId: number, createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    try {
      const country = await this.findCountryById(countryId);

      Object.assign(country, createCountryDto);
      return await this.countryRepository.save(country);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Country with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCountry(countryId: number): Promise<DeleteResult> {
    try {
      const country = await this.findCountryById(countryId);

      return await this.countryRepository.delete(country);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addCityToCountry(countryId: number, cityId: number): Promise<CountryEntity> {
    try {
      const city = await this.cityRepository.findOne(cityId);

      if (!city) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
      const country = await this.countryRepository.findOne(countryId, {
        relations: ['cities'],
      });

      if (!country) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      const isNotInCountries = country.cities.findIndex(cityInCountry => cityInCountry.id === city.id) === -1;

      if (isNotInCountries) {
        country.cities.push(city);
        await this.countryRepository.save(country);
        await this.cityRepository.save(city);
      }

      return country;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCityFromCountry(countryId: number, cityId: number): Promise<CountryEntity> {
    try {
      const city = await this.cityRepository.findOne(cityId);

      if (!city) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
      const country = await this.countryRepository.findOne(countryId, {
        relations: ['cities'],
      });

      if (!country) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      }

      const cityIndex = country.cities.findIndex(cityInCountry => cityInCountry.id === city.id);

      if (cityIndex >= 0) {
        country.cities.splice(cityIndex, 1);
        await this.countryRepository.save(country);
        await this.cityRepository.save(city);
      }

      return country;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  buildCountryResponse(country: CountryEntity) {
    return { country };
  }
}
