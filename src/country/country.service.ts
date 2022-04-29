import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';

@Injectable()
export class CountryService {
  constructor(@InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>) {}
  async findAll(): Promise<CountryEntity[]> {
    return await this.countryRepository.find();
  }
}
