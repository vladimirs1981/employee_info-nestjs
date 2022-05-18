import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Put, Delete, Patch } from '@nestjs/common';
import { ProjectService } from '@app/project/project.service';
import { ProjectEntity } from '@app/project/project.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectResponseInterface } from '@app/project/types/projectResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('projects')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) {}
  @Get()
  @ApiOkResponse({ type: [ProjectEntity], status: 200 })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async getAll(): Promise<{ projects: ProjectEntity[] }> {
    const projects = await this.projectsService.findAll();

    return { projects };
  }

  @Get(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project has been successfuly fetched',
    type: ProjectEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.findProjectById(id);
    return this.projectsService.buildProjectResponse(project);
  }

  @Post()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateProjectDto,
  })
  @ApiCreatedResponse({ type: ProjectEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createProject(@Body('project') createProjectDto: CreateProjectDto): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.createProject(createProjectDto);

    return this.projectsService.buildProjectResponse(project);
  }

  @Put(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project name has been successfuly updated',
    type: ProjectEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project with given id does not exist',
  })
  @ApiBody({
    description: 'name is required',
    type: CreateProjectDto,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateProject(@Body('project') createProjectDto: CreateProjectDto, @Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.updateProject(createProjectDto, id);
    return this.projectsService.buildProjectResponse(project);
  }

  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project  has been successfuly deleted',
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: 'A project with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Post(':id/project_manager/:pmId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'pmId',
    required: true,
    description: 'Should be an id of a project manager that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project manager has been successfuly added to project',
    type: ProjectEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project od project manager with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async addProjectManagerToProject(@Param('id', ParseIntPipe) id: number, @Param('pmId', ParseIntPipe) pmId: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.addPmToProject(id, pmId);
    return this.projectsService.buildProjectResponse(project);
  }

  @Patch(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project manager  has been successfuly removed from project',
    type: ProjectEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async removeProjectManagerFromProject(@Param('id', ParseIntPipe) id: number): Promise<ProjectResponseInterface> {
    const project = await this.projectsService.removePmFromProject(id);
    return this.projectsService.buildProjectResponse(project);
  }
}
