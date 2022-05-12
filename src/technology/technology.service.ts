import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateTechnologyDto } from '@app/technology/dto/createTechnology.dto';

@Injectable()
export class TechnologyService {
  constructor(@InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>) {}
  async findAllTechnologies(): Promise<{ technologies: TechnologyEntity[] }> {
    const technologies = await this.technologyRepository.find();
    return { technologies };
  }

  async findOneById(technologyId: number): Promise<TechnologyEntity> {
    const technology = await this.technologyRepository.findOne(technologyId);

    if (!technology) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    return technology;
  }

  async createTechnology(createTechnologyDto: CreateTechnologyDto): Promise<TechnologyEntity> {
    const technology = new TechnologyEntity();

    Object.assign(technology, createTechnologyDto);

    return this.technologyRepository.save(technology);
  }

  async updateTechnology(id: number, createTechnologyDto: CreateTechnologyDto): Promise<TechnologyEntity> {
    const technology = await this.findOneById(id);

    Object.assign(technology, createTechnologyDto);

    return this.technologyRepository.save(technology);
  }

  async deleteTechnology(id: number): Promise<DeleteResult> {
    const technology = await this.findOneById(id);
    return this.technologyRepository.delete(technology);
  }

  buildTechnologyResponse(technology: TechnologyEntity) {
    return { technology };
  }
}
