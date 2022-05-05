import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CountryEntity } from './country.entity';
import { CreateCountryDto } from './dto/createCountry.dto';

@Injectable()
export class CountryService {
  constructor(@InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>) {}

  async findAll(): Promise<CountryEntity[]> {
    return await this.countryRepository.find();
  }

  async findCountryById(id: number): Promise<CountryEntity> {
    return this.countryRepository.findOne(id);
  }

  async createCountry(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const country = new CountryEntity();
    Object.assign(country, createCountryDto);
    return this.countryRepository.save(country);
  }

  async updateCountry(countryId: number, createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const country = await this.findCountryById(countryId);

    Object.assign(country, createCountryDto);
    return await this.countryRepository.save(country);
  }

  async deleteCountry(countryId: number): Promise<DeleteResult> {
    const country = await this.findCountryById(countryId);

    return await this.countryRepository.delete(country);
  }

  buildCountryResponse(country: CountryEntity) {
    return { country };
  }
}
