import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectEntity } from '@app/project/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateProjectDto } from '@app/project/dto/createProject.dto';
import { UserEntity } from '@app/user/user.entity';
import { UserRole } from '@app/user/types/userRole.enum';
import { PostgresErrorCode } from '@app/database/postgresErrorCodes.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAll(): Promise<ProjectEntity[]> {
    try {
      return await this.projectRepository.find({
        relations: ['employees', 'projectManager'],
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findProjectById(id: number): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository.findOne(id, {
        relations: ['employees', 'projectManager'],
      });
      if (!project) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      return project;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    try {
      const project = new ProjectEntity();
      Object.assign(project, createProjectDto);
      return await this.projectRepository.save(project);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Project with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProject(createProjectDto: CreateProjectDto, id: number): Promise<ProjectEntity> {
    try {
      const project = await this.findProjectById(id);

      Object.assign(project, createProjectDto);

      return await this.projectRepository.save(project);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Project with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProject(id: number): Promise<DeleteResult> {
    try {
      const project = await this.findProjectById(id);

      return await this.projectRepository.delete(id);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addPmToProject(projectId: number, pmId: number): Promise<ProjectEntity> {
    try {
      const project = await this.findProjectById(projectId);

      const project_manager = await this.userRepository.findOne({
        where: {
          id: pmId,
          role: UserRole.PROJECT_MANAGER,
        },
      });

      if (!project_manager) {
        throw new HttpException('Project manager not found or user is not project manager', HttpStatus.NOT_FOUND);
      }

      project.projectManager = project_manager;
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removePmFromProject(id: number): Promise<ProjectEntity> {
    try {
      const project = await this.findProjectById(id);

      project.projectManager = null;
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  buildProjectResponse(project: ProjectEntity) {
    return { project };
  }
}
