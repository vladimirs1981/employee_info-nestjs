import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';
import { getRepository, Repository } from 'typeorm';
import { UsersResponseInterface } from '../../user/types/usersResponse.interface';
import { query } from 'express';
import { CityEntity } from '../../city/city.entity';

@Injectable()
export class ProjectManagerService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findAll(query: any): Promise<UsersResponseInterface> {
    const queryBuilder = getRepository(UserEntity)
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.city', 'city')
      .leftJoinAndSelect('users.project', 'project')
      .leftJoinAndSelect('users.technologies', 'technologies');

    if (query.city) {
      const city = await this.cityRepository.findOne({
        name: query.city,
      });

      queryBuilder.andWhere('users.cityId = :id', {
        id: city.id,
      });
    }
  }
}
