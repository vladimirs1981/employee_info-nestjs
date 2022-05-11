import { UsersResponseInterface } from '@app/user/types/usersResponse.interface';
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ProjectManagerService } from './projectManager.service';
import { User } from '@app/user/decorators/user.decorator';
import { ProjectsResponseInterface } from '../project/types/projectsResponse.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserRole } from '@app/user/types/userRole.enum';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('pm')
@ApiTags('project_managers')
export class ProjectManagerController {
  constructor(private readonly projectManagerService: ProjectManagerService) {}
  // 1. get all employees - pagination and filtering
  @Get('employees')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllEmployees(@Query() query: any): Promise<UsersResponseInterface> {
    return this.projectManagerService.findAll(query);
  }
  // 2. get all employees for PM - pagination and filtering
  @Get('pm-employees')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllEmployeesForCurrentPm(@User('id') currentUserId: number, @Query() query: any): Promise<UsersResponseInterface> {
    return this.projectManagerService.findAllForCurrentUser(currentUserId, query);
  }
  // 3. get all projects
  @Get('projects')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllProjects(@Query() query: any): Promise<ProjectsResponseInterface> {
    return this.projectManagerService.findAllProjects(query);
  }

  // 4. get all projects for current user
  @Get('pm-projects')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllProjectsForCurrentUser(@User('id') currentUserId: number, @Query() query: any): Promise<ProjectsResponseInterface> {
    return this.projectManagerService.findAllProjectsForCurrentUser(currentUserId, query);
  }
  // 5. get single employee
  @Get('employees/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseInterface> {
    const user = await this.projectManagerService.findById(id);
    return { user };
  }
}
