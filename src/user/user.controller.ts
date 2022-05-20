import { Body, Controller, Get, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe, ParseIntPipe, Param, Delete, Logger } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
import { UserRoleValidationPipe } from '@app/user/pipes/userRole.validation.pipe';
import { UserRole } from '@app/user/types/userRole.enum';
import { UserSeniority } from '@app/user/types/userSeniority.enum';
import { UserSeniorityValidationPipe } from '@app/user/pipes/userSeniority.validatrion.pipe';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { threadId } from 'worker_threads';
import { UsersResponseInterface } from '../../dist/user/types/usersResponse.interface';

@Controller()
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('users')
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get('users')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER, UserRole.ADMIN)
  async getAllUsers(): Promise<{ users: UserEntity[] }> {
    this.logger.verbose('Retrieving all users');
    const users = await this.userService.findAllUsers();
    return { users };
  }

  @Get('users/single-user/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfuly retrieved',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER, UserRole.ADMIN)
  async getOneUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Retrieving user with an id:${id}`);
    const user = await this.userService.findById(id);
    return this.userService.buildUserResponse(user);
  }

  // create new user
  @Post('users')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({ type: UserEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    this.logger.verbose(`Creating a new user. Data:${JSON.stringify(createUserDto)}`);
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  // edit user
  @Put('users/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A user name has been successfuly updated',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @ApiBody({
    description: 'firstName, lastName and email are required',
    type: UpdateUserDto,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    this.logger.verbose(`Updating user with id:${id}. Data:${JSON.stringify(updateUserDto)}`);
    const user = await this.userService.updateUser(id, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  // add seniority to user
  @Patch('users/seniority/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfuly updated',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @ApiBody({
    description: 'intern, junior, medior or senior',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateUserSeniority(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority,
  ): Promise<UserResponseInterface> {
    this.logger.verbose(`Adding seniority ${seniority} to user with id:${userId}`);
    const user = await this.userService.updateUserSeniority(userId, seniority);

    return this.userService.buildUserResponse(user);
  }

  // add city to user
  @Post('users/:userId/city/:cityId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'cityId',
    required: true,
    description: 'Should be an id of a city that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A city has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A city or user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addCityToUser(@Param('userId', ParseIntPipe) userId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Adding city (id:${cityId}) to user (id:${userId})`);
    const user = await this.userService.addCityToUser(userId, cityId);

    return this.userService.buildUserResponse(user);
  }

  //add project to user
  @Post('users/:userId/project/:projectId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'projectId',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project or user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async addProjectToUser(@Param('userId', ParseIntPipe) userId: number, @Param('projectId', ParseIntPipe) projectId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Adding project (id:${projectId}) to user (id:${userId})`);
    const user = await this.userService.addProjectToUser(userId, projectId);

    return this.userService.buildUserResponse(user);
  }

  // Remove user from project
  @Post('users/project/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A user has been successfuly removed from project',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async removeUserFromProject(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Removing user with id ${userId} from project`);
    const user = await this.userService.removeUserFromProject(userId);
    return this.userService.buildUserResponse(user);
  }

  @Get('users/no-project')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'A users are successfuly retrieved',
    type: UserEntity,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async getAllUsersWithoutProject(): Promise<{ users: UserEntity[] }> {
    this.logger.verbose(`Retrieving all users without project`);
    const users = await this.userService.findAllUsersWithoutProject();
    return { users };
  }

  // add technology to user
  @Post('/users/:userId/technology/:technologyId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'technologyId',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology or user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addTechnologyToUser(@Param('userId', ParseIntPipe) userId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Adding technology (id:${technologyId}) to user (id:${userId})`);
    const user = await this.userService.addTechnologyToUser(userId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // remove technology from user
  @Delete('/users/:userId/technology/:technologyId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiParam({
    name: 'technologyId',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology has been successfuly removed from user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology or user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeTechnologyFromUser(@Param('userId', ParseIntPipe) userId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Removing technlogy (id:${technologyId}) from user (id:${userId})`);
    const user = await this.userService.removeTechnologyFromUser(userId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // ------------------ Employee --------------

  // get all employees
  @Get('users/employees')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [UserEntity], description: 'Fetch all users with role employee' })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async getAllEmployees(): Promise<{ employees: UserEntity[] }> {
    this.logger.verbose('Retrieving all employees.');
    const employees = await this.userService.findAllEmployees();
    return { employees };
  }

  // ------------------ ADMIN -----------------

  // get all admins
  @Get('users/admins')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [UserEntity], description: 'Fetch all users with role admin' })
  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllAdmins(): Promise<{ admins: UserEntity[] }> {
    this.logger.verbose('Retrieving all admins.');
    const admins = await this.userService.findAllAdmins();
    return { admins };
  }

  // create admin
  @Post('users/admins/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A admin has been successfuly created',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A  user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createAdmin(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Creating admin of user with id:${userId}`);
    const user = await this.userService.createAdmin(userId);

    return this.userService.buildUserResponse(user);
  }

  // remove from admins
  @Put('users/admins/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A admin has been successfuly deleted',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A  user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeUserFromAdmins(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Removing user with id:${userId} from admins`);
    const user = await this.userService.removeFromAdmins(userId);

    return this.userService.buildUserResponse(user);
  }

  // ------------ Project Manager -----------------

  // get all project managers
  @Get('users/pm')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [UserEntity], description: 'Fetch all users with role project_manager' })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async getAllPMs(): Promise<{ project_managers: UserEntity[] }> {
    this.logger.verbose('Retrieving all project_managers.');
    const project_managers = await this.userService.findAllPMs();
    return { project_managers };
  }

  //create project manager
  @Post('users/pm/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project_manager has been successfuly created',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A  user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createPm(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Creating project_manager from user with id:${userId}`);
    const user = await this.userService.createPm(userId);

    return this.userService.buildUserResponse(user);
  }

  // remove from project managers
  @Put('users/pm/:userId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project_manager has been successfuly deleted',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A  user with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async removeUserFromPMs(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Removing user with id:${userId} from project_managers`);
    const user = await this.userService.removeFromPMs(userId);

    return this.userService.buildUserResponse(user);
  }

  //----------CURRENT USER-----------------

  // get current user
  @Get('user')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    this.logger.verbose(`Retrieving current logged in user:${user.firstName} ${user.lastName}`);
    return this.userService.buildUserResponse(user);
  }

  // edit current user
  @Put('user')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'A user name has been successfuly updated',
    type: UserEntity,
  })
  @ApiBody({
    description: 'firstName, lastName and email are required',
    type: UpdateUserDto,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    this.logger.verbose(`Editing current user (id:${currentUserId}). Data:${JSON.stringify(updateUserDto)}`);
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  // edit current user role
  @Patch('user/role')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'A user role has been successfuly updated',
    type: UserEntity,
  })
  @ApiBody({
    description: 'admin, project_manager or employee',
    type: String,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUserRole(@User('id') currentUserId: number, @Body('role', UserRoleValidationPipe) role: UserRole): Promise<UserResponseInterface> {
    this.logger.verbose(`Updating current user role. New role: ${role}`);
    const user = await this.userService.updateUserRole(currentUserId, role);

    return this.userService.buildUserResponse(user);
  }

  // edit current user seniority (intern, junior, medior, senior)
  @Patch('user/seniority')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiResponse({
    status: 200,
    description: 'A user seniority has been successfuly updated',
    type: UserEntity,
  })
  @ApiBody({
    description: 'intern, junior, medior or senior',
    type: String,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUserSeniority(@User('id') currentUserId: number, @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority): Promise<UserResponseInterface> {
    this.logger.verbose(`Updating current user seniority. New seniority: ${seniority}`);
    const user = await this.userService.updateUserSeniority(currentUserId, seniority);

    return this.userService.buildUserResponse(user);
  }

  // add city to current user
  @Post('user/city/:cityId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'cityId',
    required: true,
    description: 'Should be an id of a city that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A city has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A city with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async addCityToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Add city with id:${cityId} to current user.`);
    const user = await this.userService.addCityToUser(currentUserId, cityId);

    return this.userService.buildUserResponse(user);
  }

  //add project to current user
  @Post('user/project/:projectId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'projectId',
    required: true,
    description: 'Should be an id of a project that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A project has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A project with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async addProjectToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('projectId', ParseIntPipe) projectId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Add project with id:${projectId} to current user.`);
    const user = await this.userService.addProjectToUser(currentUserId, projectId);

    return this.userService.buildUserResponse(user);
  }

  // add technology to current user
  @Post('/user/technology/:technologyId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'technologyId',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology has been successfuly added to user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async addTechnologyToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    this.logger.verbose(`Add technology with id:${technologyId} to current user.`);
    const user = await this.userService.addTechnologyToUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // remove technology from current user
  @Delete('/user/technology/:technologyId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'technologyId',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology has been successfuly removed from user',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async removeTechnologyFromCurrentUser(
    @User('id', ParseIntPipe) currentUserId: number,
    @Param('technologyId', ParseIntPipe) technologyId: number,
  ): Promise<UserResponseInterface> {
    this.logger.verbose(`Remove technology with id:${technologyId} from current user.`);
    const user = await this.userService.removeTechnologyFromUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }
}
