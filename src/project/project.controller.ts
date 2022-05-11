import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Put, Delete, Patch } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectEntity } from './project.entity';
import { AuthGuard } from '../user/guards/auth.guard';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectResponseInterface } from './types/projectResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) {}
  @Get()
  @Roles(UserRole.ADMIN)
  async getAll(): Promise<{ projects: ProjectEntity[] }> {
    const projects = await this.projectsService.findAll();

    return { projects };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.findProjectById(id);
    return this.projectsService.buildProjectResponse(project);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createProject(@Body('project') createProjectDto: CreateProjectDto): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.createProject(createProjectDto);

    return this.projectsService.buildProjectResponse(project);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateProject(@Body('project') createProjectDto: CreateProjectDto, @Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.updateProject(createProjectDto, id);
    return this.projectsService.buildProjectResponse(project);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Post(':id/project_manager/:pmId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addProjectManagerToProject(@Param('id', ParseIntPipe) id: number, @Param('pmId', ParseIntPipe) pmId: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.addPmToProject(id, pmId);
    return this.projectsService.buildProjectResponse(project);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeProjectManagerFromProject(@Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.removePmFromProject(id);
    return this.projectsService.buildProjectResponse(project);
  }
}
