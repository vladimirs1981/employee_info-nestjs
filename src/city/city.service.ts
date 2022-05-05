import { Injectable } from '@nestjs/common';
import { CreateCityDto } from '@app/city/dto/createCity.dto';
import { CityEntity } from '@app/city/city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityResponseInterface } from './types/cityResponse.interface';

@Injectable()
export class CityService {
  constructor(@InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>) {}

  async createCity(createCityDto: CreateCityDto): Promise<CityEntity> {
    const city = new CityEntity();
    Object.assign(city, createCityDto);
    return await this.cityRepository.save(city);
  }

  buildCityResponse(city: CityEntity): CityResponseInterface {
    return { city };
  }
}
