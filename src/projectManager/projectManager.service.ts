import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { getRepository, QueryBuilder, Repository } from 'typeorm';
import { TechnologyEntity } from '../technology/technology.entity';
import { UsersResponseInterface } from '../user/types/usersResponse.interface';
import { ProjectEntity } from '@app/project/project.entity';
import { ProjectsResponseInterface } from '../project/types/projectsResponse.interface';

@Injectable()
export class ProjectManagerService {
  constructor(
    @InjectRepository(TechnologyEntity) private readonly technologyRepository: Repository<TechnologyEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(query: any): Promise<UsersResponseInterface> {
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
      queryBuilder.andWhere('users.cityId = :id', {
        id: query.city,
      });
    }

    if (query.country) {
      queryBuilder.andWhere('city.countryId = :id', {
        id: query.country,
      });
    }

    if (query.seniority) {
      queryBuilder.andWhere('users.seniority = :seniority', {
        seniority: query.seniority,
      });
    }

    if (query.project) {
      queryBuilder.andWhere('users.projectId = :id', {
        id: query.project,
      });
    }

    if (query.projectManager) {
      queryBuilder.andWhere('project.projectManagerId = :id', {
        id: query.projectManager,
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
  }

  async findAllForCurrentUser(currentUserId: number, query: any): Promise<UsersResponseInterface> {
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
      queryBuilder.andWhere('users.cityId = :id', {
        id: query.city,
      });
    }

    if (query.country) {
      queryBuilder.andWhere('city.countryId = :id', {
        id: query.country,
      });
    }

    if (query.seniority) {
      queryBuilder.andWhere('users.seniority = :seniority', {
        seniority: query.seniority,
      });
    }

    if (query.project) {
      queryBuilder.andWhere('users.projectId = :id', {
        id: query.project,
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
  }

  async findAllProjects(query: any): Promise<ProjectsResponseInterface> {
    const queryBuilder = getRepository(ProjectEntity)
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.employees', 'employees')
      .loadRelationCountAndMap('projects.employeesCount', 'projects.employees');

    if (query.search) {
      queryBuilder.andWhere('projects.name LIKE :search', { search: `%${query.search}%` });
    }

    const projects = await queryBuilder.getMany();

    return { projects };
  }

  async findAllProjectsForCurrentUser(currentUserId: number, query: any): Promise<ProjectsResponseInterface> {
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
  }

  async findById(id: number): Promise<UserEntity> {
    const queryBuilder = getRepository(UserEntity)
      .createQueryBuilder('users')
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
  }
}
