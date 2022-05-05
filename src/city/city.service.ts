import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCityDto } from '@app/city/dto/createCity.dto';
import { CityEntity } from '@app/city/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CityResponseInterface } from './types/cityResponse.interface';
import { CountryEntity } from '../country/country.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findAllCities(): Promise<CityEntity[]> {
    return await this.cityRepository.find({
      relations: ['country'],
    });
  }

  async findCityById(id: number): Promise<CityEntity> {
    return this.cityRepository.findOne(id);
  }

  async createCity(createCityDto: CreateCityDto, countryId: number): Promise<CityEntity> {
    const country = await this.countryRepository.findOne(countryId);

    if (!country) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }

    const city = new CityEntity();
    Object.assign(city, createCityDto);

    city.country = country;

    return await this.cityRepository.save(city);
  }

  async updateCity(cityId: number, createCityDto: CreateCityDto): Promise<CityEntity> {
    const city = await this.findCityById(cityId);

    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(city, createCityDto);
    return await this.cityRepository.save(city);
  }

  async deleteCity(cityId: number): Promise<DeleteResult> {
    const city = await this.findCityById(cityId);
    return this.cityRepository.delete(city);
  }

  buildCityResponse(city: CityEntity): CityResponseInterface {
    return { city };
  }
}
