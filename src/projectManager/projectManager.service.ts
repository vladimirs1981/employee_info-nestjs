import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { getRepository, Repository } from 'typeorm';
import { UsersResponseInterface } from '@app/user/types/usersResponse.interface';
import { ProjectEntity } from '@app/project/project.entity';
import { ProjectsResponseInterface } from '@app/project/types/projectsResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '@app/city/city.entity';
import { CountryEntity } from '../country/country.entity';
import { TechnologyEntity } from '@app/technology/technology.entity';

@Injectable()
export class ProjectManagerService {
  constructor(
    @InjectRepository(CityEntity) private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>,
  ) {}
  async findAll(query: any): Promise<UsersResponseInterface> {
    try {
      const queryBuilder = getRepository(UserEntity)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.city', 'city')
        .leftJoinAndSelect('users.project', 'project')
        .leftJoinAndSelect('users.technologies', 'technologies')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('project.projectManager', 'projectManager');

      if (query.search) {
        queryBuilder.andWhere('users.firstName LIKE :search OR users.lastName LIKE :search', { search: `%${query.search}%` });
      }

      if (query.city) {
        const city = await this.cityRepository.findOne({ name: query.city });
        queryBuilder.andWhere('users.cityId = :id', {
          id: city.id,
        });
      }

      if (query.technology) {
        const technology = await this.technologyRepository.findOne({ name: query.technology });
        queryBuilder.andWhere('technologies.name = :name', {
          name: technology.name,
        });
      }

      if (query.country) {
        const country = await this.countryRepository.findOne({ name: query.country });
        queryBuilder.andWhere('city.countryId = :id', {
          id: country.id,
        });
      }

      if (query.seniority) {
        queryBuilder.andWhere('users.seniority = :seniority', {
          seniority: query.seniority,
        });
      }

      if (query.project) {
        const project = await this.projectRepository.findOne({ name: query.project });
        queryBuilder.andWhere('users.projectId = :id', {
          id: project.id,
        });
      }

      if (query.projectManager) {
        const projectManager = await this.userRepository.findOne({ id: query.projectManager });
        queryBuilder.andWhere('project.projectManagerId = :id', {
          id: projectManager.id,
        });
      }

      const page: number = parseInt(query.page) || 1;
      const perPage = 100;
      const total = await queryBuilder.getCount();

      queryBuilder.offset((page - 1) * perPage).limit(perPage);

      const users = await queryBuilder.getMany();

      return {
        employees: users,
        employeesCount: total,
        current_page: page,
        last_page: Math.ceil(total / perPage),
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllForCurrentUser(currentUserId: number, query: any): Promise<UsersResponseInterface> {
    try {
      const queryBuilder = getRepository(UserEntity)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.city', 'city')
        .leftJoinAndSelect('users.project', 'project')
        .leftJoinAndSelect('users.technologies', 'technologies')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('project.projectManager', 'projectManager')
        .where('project.projectManagerId = :id', {
          id: currentUserId,
        });

      if (query.search) {
        queryBuilder.andWhere('users.firstName LIKE :search OR users.lastName LIKE :search', { search: `%${query.search}%` });
      }

      if (query.city) {
        const city = await this.cityRepository.findOne({ name: query.city });
        queryBuilder.andWhere('users.cityId = :id', {
          id: city.id,
        });
      }

      if (query.technology) {
        const technology = await this.technologyRepository.findOne({ name: query.technology });
        queryBuilder.andWhere('technologies.name = :name', {
          name: technology.name,
        });
      }

      if (query.country) {
        const country = await this.countryRepository.findOne({ name: query.country });
        queryBuilder.andWhere('city.countryId = :id', {
          id: country.id,
        });
      }

      if (query.seniority) {
        queryBuilder.andWhere('users.seniority = :seniority', {
          seniority: query.seniority,
        });
      }

      if (query.project) {
        const project = await this.projectRepository.findOne({ name: query.project });
        queryBuilder.andWhere('users.projectId = :id', {
          id: project.id,
        });
      }

      const page: number = parseInt(query.page) || 1;
      const perPage = 100;
      const total = await queryBuilder.getCount();

      queryBuilder.offset((page - 1) * perPage).limit(perPage);

      const users = await queryBuilder.getMany();

      return {
        employees: users,
        employeesCount: total,
        current_page: page,
        last_page: Math.ceil(total / perPage),
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllProjects(query: any): Promise<ProjectsResponseInterface> {
    try {
      const queryBuilder = getRepository(ProjectEntity)
        .createQueryBuilder('projects')
        .leftJoinAndSelect('projects.employees', 'employees')
        .loadRelationCountAndMap('projects.employeesCount', 'projects.employees');

      if (query.search) {
        queryBuilder.andWhere('projects.name LIKE :search', { search: `%${query.search}%` });
      }

      const projects = await queryBuilder.getMany();

      return { projects };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllProjectsForCurrentUser(currentUserId: number, query: any): Promise<ProjectsResponseInterface> {
    try {
      const queryBuilder = getRepository(ProjectEntity)
        .createQueryBuilder('projects')
        .leftJoinAndSelect('projects.projectManager', 'projectManager')
        .where('projects.projectManagerId = :id', {
          id: currentUserId,
        })
        .leftJoinAndSelect('projects.employees', 'employees')
        .loadRelationCountAndMap('projects.employeesCount', 'projects.employees');

      if (query.search) {
        queryBuilder.andWhere('projects.name LIKE :search', { search: `%${query.search}%` });
      }

      const projects = await queryBuilder.getMany();

      return { projects };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      const queryBuilder = getRepository(UserEntity)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.city', 'city')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('users.technologies', 'technologies')
        .leftJoinAndSelect('users.project', 'project')
        .leftJoinAndSelect('users.notes', 'notes')
        .orderBy({
          'notes.createdAt': 'DESC',
        })
        .leftJoinAndSelect('project.projectManager', 'projectManager')
        .where('users.id = :id', {
          id: id,
        });

      const user = await queryBuilder.getOne();

      return user;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
