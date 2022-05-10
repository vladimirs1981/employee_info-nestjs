import { UsersResponseInterface } from '@app/user/types/usersResponse.interface';
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { ProjectManagerService } from './projectManager.service';
import { User } from '@app/user/decorators/user.decorator';
import { query } from 'express';
import { ProjectsResponseInterface } from '../project/types/projectsResponse.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';

@Controller('pm')
export class ProjectManagerController {
  constructor(private readonly projectManagerService: ProjectManagerService) {}
  // 1. get all employees - pagination and filtering
  @Get('employees')
  @UseGuards(AuthGuard)
  async getAllEmployees(@Query() query: any): Promise<UsersResponseInterface> {
    return this.projectManagerService.findAll(query);
  }
  // 2. get all employees for PM
  @Get('pm-employees')
  @UseGuards(AuthGuard)
  async getAllEmployeesForCurrentPm(@User('id') currentUserId: number, @Query() query: any): Promise<UsersResponseInterface> {
    return this.projectManagerService.findAllForCurrentUser(currentUserId, query);
  }
  // 3. get all projects
  @Get('projects')
  @UseGuards(AuthGuard)
  async getAllProjects(@Query() query: any): Promise<ProjectsResponseInterface> {
    return this.projectManagerService.findAllProjects(query);
  }

  @Get('pm-projects')
  @UseGuards(AuthGuard)
  async getAllProjectsForCurrentUser(@User('id') currentUserId: number, @Query() query: any): Promise<ProjectsResponseInterface> {
    return this.projectManagerService.findAllProjectsForCurrentUser(currentUserId, query);
  }
  // 4. get single employee
  @Get('employees/:id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseInterface> {
    const user = await this.projectManagerService.findById(id);
    return { user };
  }
  // 5. get all notes for employee
  // 6. add a new note to employee
}
