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

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create new user
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  // get current user
  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  // edit current user
  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  // edit current user role
  @Patch('user/role')
  @UseGuards(AuthGuard)
  async updateCurrentUserRole(@User('id') currentUserId: number, @Body('role', UserRoleValidationPipe) role: UserRole): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserRole(currentUserId, role);

    return this.userService.buildUserResponse(user);
  }

  // edit current user seniority (intern, junior, medior, senior)
  @Patch('user/seniority')
  @UseGuards(AuthGuard)
  async updateCurrentUserSeniority(@User('id') currentUserId: number, @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserSeniority(currentUserId, seniority);

    return this.userService.buildUserResponse(user);
  }

  // add city to current user
  @Post('user/city/:cityId')
  @UseGuards(AuthGuard)
  async addCityToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addCityToUser(currentUserId, cityId);

    return this.userService.buildUserResponse(user);
  }

  // add technology to current user
  @Post('/user/technology/:technologyId')
  @UseGuards(AuthGuard)
  async addTechnologyToCurrentUser(@User('id', ParseIntPipe) currentUserId: number, @Param('technologyId', ParseIntPipe) technologyId: number): Promise<UserResponseInterface> {
    const user = await this.userService.addTechnologyToUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }

  // remove technology from current user
  @Delete('/user/technology/:technologyId')
  @UseGuards(AuthGuard)
  async removeTechnologyFromCurrentUser(
    @User('id', ParseIntPipe) currentUserId: number,
    @Param('technologyId', ParseIntPipe) technologyId: number,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.removeTechnologyFromUser(currentUserId, technologyId);

    return this.userService.buildUserResponse(user);
  }
}
