import { Body, Controller, Get, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe, ParseIntPipe, Param, Delete } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRoleValidationPipe } from './pipes/userRole.validation.pipe';
import { UserRole } from './types/userRole.enum';
import { UserSeniority } from './types/userSeniority.enum';
import { UserSeniorityValidationPipe } from './pipes/userSeniority.validatrion.pipe';
import { Roles } from './decorators/userRoles.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get('users')
  @UseGuards(AuthGuard)
  @Roles(UserRole.PROJECT_MANAGER, UserRole.ADMIN)
  async getAllUsers(): Promise<{ users: UserEntity[] }> {
    const users = await this.userService.findAllUsers();
    return { users };
  }

  // create new user
  @Post('users')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  // edit user
  @Put('users/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(id, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  // add seniority to user
  @Patch('users/seniority/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateUserSeniority(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserSeniority(userId, seniority);

    return this.userService.buildUserResponse(user);
  }

  // add city to user
  @Post('users/:userId/city/:cityId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addCityToUser(@Param('userId', ParseIntPipe) userId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addCityToUser(userId, cityId);

    return this.userService.buildUserResponse(user);
  }

  //add project to user
  @Post('users/:userId/project/:projectId')
  @UseGuards(AuthGuard)
  async addProjectToUser(@Param('userId', ParseIntPipe) userId: number, @Param('projectId', ParseIntPipe) projectId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addProjectToUser(userId, projectId);

    return this.userService.buildUserResponse(user);
  }

  // add technology to user
  @Post('/users/:userId/technology/:technologyId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addTechnologyToUser(@Param('userId', ParseIntPipe) userId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addTechnologyToUser(userId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // remove technology from user
  @Delete('/users/:userId/technology/:technologyId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeTechnologyFromUser(@Param('userId', ParseIntPipe) userId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    const user = await this.userService.removeTechnologyFromUser(userId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // ------------------ Employee --------------

  // get all employees
  @Get('users/employees')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async getAllEmployees(): Promise<{ employees: UserEntity[] }> {
    const employees = await this.userService.findAllEmployees();
    return { employees };
  }

  // ------------------ ADMIN -----------------

  // get all admins
  @Get('users/admins')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllAdmins(): Promise<{ admins: UserEntity[] }> {
    const admins = await this.userService.findAllAdmins();
    return { admins };
  }

  // create admin
  @Post('users/admins/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createAdmin(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    const user = await this.userService.createAdmin(userId);

    return this.userService.buildUserResponse(user);
  }

  // remove from admins
  @Put('users/admins/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeUserFromAdmins(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    const user = await this.userService.removeFromAdmins(userId);

    return this.userService.buildUserResponse(user);
  }

  // ------------ Project Manager -----------------

  // get all project managers
  @Get('users/pm')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllPMs(): Promise<{ project_managers: UserEntity[] }> {
    const project_managers = await this.userService.findAllPMs();
    return { project_managers };
  }

  //create project manager
  @Post('users/pm/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createPm(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    const user = await this.userService.createPm(userId);

    return this.userService.buildUserResponse(user);
  }

  // remove from project managers
  @Put('users/pm/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async removeUserFromPMs(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseInterface> {
    const user = await this.userService.removeFromPMs(userId);

    return this.userService.buildUserResponse(user);
  }

  //----------CURRENT USER-----------------

  // get current user
  @Get('user')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  // edit current user
  @Put('user')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  // edit current user role
  @Patch('user/role')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUserRole(@User('id') currentUserId: number, @Body('role', UserRoleValidationPipe) role: UserRole): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserRole(currentUserId, role);

    return this.userService.buildUserResponse(user);
  }

  // edit current user seniority (intern, junior, medior, senior)
  @Patch('user/seniority')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async updateCurrentUserSeniority(@User('id') currentUserId: number, @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserSeniority(currentUserId, seniority);

    return this.userService.buildUserResponse(user);
  }

  // add city to current user
  @Post('user/city/:cityId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async addCityToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addCityToUser(currentUserId, cityId);

    return this.userService.buildUserResponse(user);
  }

  //add project to current user
  @Post('user/project/:projectId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async addProjectToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('projectId', ParseIntPipe) projectId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addProjectToUser(currentUserId, projectId);

    return this.userService.buildUserResponse(user);
  }

  // add technology to current user
  @Post('/user/technology/:technologyId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async addTechnologyToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addTechnologyToUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // remove technology from current user
  @Delete('/user/technology/:technologyId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE)
  async removeTechnologyFromCurrentUser(
    @User('id', ParseIntPipe) currentUserId: number,
    @Param('technologyId', ParseIntPipe) technologyId: number,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.removeTechnologyFromUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }
}
