import { Body, Controller, Get, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Patch('user/role')
  @UseGuards(AuthGuard)
  async updateCurrentUserRole(@User('id') currentUserId: number, @Body('role', UserRoleValidationPipe) role: UserRole): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserRole(currentUserId, role);

    return this.userService.buildUserResponse(user);
  }

  @Patch('user/seniority')
  @UseGuards(AuthGuard)
  async updateCurrentUserSeniority(@User('id') currentUserId: number, @Body('seniority', UserSeniorityValidationPipe) seniority: UserSeniority): Promise<UserResponseInterface> {
    const user = await this.userService.updateUserSeniority(currentUserId, seniority);

    return this.userService.buildUserResponse(user);
  }
}
