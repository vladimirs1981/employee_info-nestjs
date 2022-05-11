import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { TechnologyService } from '@app/technology/technology.service';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateTechnologyDto } from '@app/technology/dto/createTechnology.dto';
import { TechnologyResponseInterface } from '@app/technology/types/technologyResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';

@Controller('technologies')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<{ technologies: TechnologyEntity[] }> {
    return this.technologyService.findAllTechnologies();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id', ParseIntPipe) technologyId: number): Promise<TechnologyResponseInterface> {
    const technology = await this.technologyService.findOneById(technologyId);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('technology') createTechnologyDto: CreateTechnologyDto): Promise<TechnologyResponseInterface> {
    const technology = await this.technologyService.createTechnology(createTechnologyDto);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id', ParseIntPipe) technologyId: number, @Body('technology') createTechnologyDto: CreateTechnologyDto): Promise<TechnologyResponseInterface> {
    const technology = await this.technologyService.updateTechnology(technologyId, createTechnologyDto);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseIntPipe) technologyId: number) {
    return this.technologyService.deleteTechnology(technologyId);
  }
}
