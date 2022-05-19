import { UsersResponseInterface } from '@app/user/types/usersResponse.interface';
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { ProjectManagerService } from '@app/projectManager/projectManager.service';
import { User } from '@app/user/decorators/user.decorator';
import { ProjectsResponseInterface } from '@app/project/types/projectsResponse.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { UserRole } from '@app/user/types/userRole.enum';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@app/user/user.entity';
import { ProjectEntity } from '@app/project/project.entity';
import { EmployeeFilterDto } from './dto/employee.filter.dto';

@Controller('pm')
@ApiTags('project_managers')
export class ProjectManagerController {
  private logger = new Logger('ProjectManagerController');
  constructor(private readonly projectManagerService: ProjectManagerService) {}
  // 1. get all employees - pagination and filtering
  @Get('employees')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    description: 'you can query by city, country, project, technology and seniority by name, project manager by id and you can search user firstName and lastName',
    example: 'http://localhost:3005/pm/employees?city=1',
    type: EmployeeFilterDto,
  })
  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllEmployees(@Query() query: EmployeeFilterDto): Promise<UsersResponseInterface> {
    this.logger.verbose(`Retrieving all employees. Filter:${JSON.stringify(query)}`);
    return this.projectManagerService.findAll(query);
  }
  // 2. get all employees for PM - pagination and filtering
  @Get('pm-employees')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    description: 'you can query by city, country, project, seniority by name, and you can search user firstName and lastName',
    example: 'http://localhost:3005/pm/employees?seniority=junior',
    type: EmployeeFilterDto,
  })
  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllEmployeesForCurrentPm(@User('id') currentUserId: number, @Query() query: EmployeeFilterDto): Promise<UsersResponseInterface> {
    this.logger.verbose(`Retrieving all employees for current user with id:${currentUserId}. Filter:${JSON.stringify(query)}`);
    return this.projectManagerService.findAllForCurrentUser(currentUserId, query);
  }
  // 3. get all projects
  @Get('projects')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    description: 'you can search by project name',
    example: 'http://localhost:3005/pm/employees?search=Running App',
    type: String,
  })
  @ApiOkResponse({ type: [ProjectEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllProjects(@Query() query: string): Promise<ProjectsResponseInterface> {
    this.logger.verbose(`Retrieving all projects. Filter:${JSON.stringify(query)}`);
    return this.projectManagerService.findAllProjects(query);
  }

  // 4. get all projects for current user
  @Get('pm-projects')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    description: 'you can search by project name',
    example: 'http://localhost:3005/pm/employees?search=Running App',
    type: String,
  })
  @ApiOkResponse({ type: [ProjectEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getAllProjectsForCurrentUser(@User('id') currentUserId: number, @Query() query: string): Promise<ProjectsResponseInterface> {
    this.logger.verbose(`Retrieving all projects for current user with id:"${currentUserId}. Filter:${JSON.stringify(query)}`);
    return this.projectManagerService.findAllProjectsForCurrentUser(currentUserId, query);
  }
  // 5. get single employee
  @Get('employees/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfuly fetched',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Retrieving single employee with an id:${id}`);
    const user = await this.projectManagerService.findById(id);
    return { user };
  }
}
