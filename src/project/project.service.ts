import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectEntity } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateProjectDto } from './dto/createProject.dto';
import { UserEntity } from '../user/user.entity';
import { UserRole } from '@app/user/types/userRole.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findAll(): Promise<ProjectEntity[]> {
    return await this.projectRepository.find({
      relations: ['employees', 'projectManager'],
    });
  }

  async findProjectById(id: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne(id, {
      relations: ['employees', 'projectManager'],
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return project;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = new ProjectEntity();
    Object.assign(project, createProjectDto);
    return await this.projectRepository.save(project);
  }

  async updateProject(createProjectDto: CreateProjectDto, id: number): Promise<ProjectEntity> {
    const project = await this.findProjectById(id);

    Object.assign(project, createProjectDto);

    return await this.projectRepository.save(project);
  }

  async deleteProject(id: number): Promise<DeleteResult> {
    const project = await this.findProjectById(id);

    return await this.projectRepository.delete(id);
  }

  async addPmToProject(projectId: number, pmId: number): Promise<ProjectEntity> {
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
  }

  async removePmFromProject(id: number): Promise<ProjectEntity> {
    const project = await this.findProjectById(id);

    project.projectManager = null;
    return await this.projectRepository.save(project);
  }

  buildProjectResponse(project: ProjectEntity) {
    return { project };
  }
}
