import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCityDto } from '@app/city/dto/createCity.dto';
import { CityEntity } from '@app/city/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CityResponseInterface } from '@app/city/types/cityResponse.interface';
import { CountryEntity } from '@app/country/country.entity';
import { PostgresErrorCode } from '@app/database/postgresErrorCodes.enum';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findAllCities(): Promise<CityEntity[]> {
    try {
      return await this.cityRepository.find({
        relations: ['country'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findCityById(id: number): Promise<CityEntity> {
    try {
      const city = await this.cityRepository.findOne(id);
      if (!city) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
      return city;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCity(createCityDto: CreateCityDto): Promise<CityEntity> {
    try {
      const city = new CityEntity();
      Object.assign(city, createCityDto);

      return await this.cityRepository.save(city);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('City with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCity(cityId: number, createCityDto: CreateCityDto): Promise<CityEntity> {
    try {
      const city = await this.findCityById(cityId);

      if (!city) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(city, createCityDto);
      return await this.cityRepository.save(city);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('City with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCity(cityId: number): Promise<DeleteResult> {
    try {
      const city = await this.findCityById(cityId);
      return this.cityRepository.delete(city);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  buildCityResponse(city: CityEntity): CityResponseInterface {
    return { city };
  }
}
