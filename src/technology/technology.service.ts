import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateTechnologyDto } from '@app/technology/dto/createTechnology.dto';
import { PostgresErrorCode } from '@app/database/postgresErrorCodes.enum';

@Injectable()
export class TechnologyService {
  constructor(@InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>) {}
  async findAllTechnologies(): Promise<{ technologies: TechnologyEntity[] }> {
    try {
      const technologies = await this.technologyRepository.find();
      return { technologies };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(technologyId: number): Promise<TechnologyEntity> {
    try {
      const technology = await this.technologyRepository.findOne(technologyId);

      if (!technology) {
        throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
      }

      return technology;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTechnology(createTechnologyDto: CreateTechnologyDto): Promise<TechnologyEntity> {
    try {
      const technology = new TechnologyEntity();

      Object.assign(technology, createTechnologyDto);

      return this.technologyRepository.save(technology);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Technology with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTechnology(id: number, createTechnologyDto: CreateTechnologyDto): Promise<TechnologyEntity> {
    try {
      const technology = await this.findOneById(id);

      Object.assign(technology, createTechnologyDto);

      return this.technologyRepository.save(technology);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Technology with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTechnology(id: number): Promise<DeleteResult> {
    try {
      const technology = await this.findOneById(id);
      return this.technologyRepository.delete(technology);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  buildTechnologyResponse(technology: TechnologyEntity) {
    return { technology };
  }
}
