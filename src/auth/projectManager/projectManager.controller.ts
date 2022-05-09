import { UsersResponseInterface } from '@app/user/types/usersResponse.interface';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../user/guards/auth.guard';
import { UserEntity } from '../../user/user.entity';
import { ProjectManagerService } from './projectManager.service';

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
  // 3. get all projects
  // 4. get single employee
  // 5. get all notes for employee
  // 6. add a new note to employee
}
