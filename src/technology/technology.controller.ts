import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Put, Delete, Logger } from '@nestjs/common';
import { TechnologyService } from '@app/technology/technology.service';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateTechnologyDto } from '@app/technology/dto/createTechnology.dto';
import { TechnologyResponseInterface } from '@app/technology/types/technologyResponse.interface';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('technologies')
@ApiTags('technologies')
export class TechnologyController {
  private logger = new Logger('TechnologyController');
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [TechnologyEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async findAll(): Promise<{ technologies: TechnologyEntity[] }> {
    this.logger.verbose('Retrieving all technologies');
    return this.technologyService.findAllTechnologies();
  }

  @Get(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology has been successfuly fetched',
    type: TechnologyEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id', ParseIntPipe) technologyId: number): Promise<TechnologyResponseInterface> {
    this.logger.verbose(`Retrieving technology with id:${technologyId}`);
    const technology = await this.technologyService.findOneById(technologyId);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Post()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateTechnologyDto,
  })
  @ApiCreatedResponse({
    status: 201,
    type: TechnologyEntity,
    description: 'A technology has been successfuly created',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('technology') createTechnologyDto: CreateTechnologyDto): Promise<TechnologyResponseInterface> {
    this.logger.verbose(`Creating new technology. Data:${JSON.stringify(createTechnologyDto)}`);
    const technology = await this.technologyService.createTechnology(createTechnologyDto);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Put(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology name has been successfuly updated',
    type: TechnologyEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology with given id does not exist',
  })
  @ApiBody({
    description: 'name is required',
    type: CreateTechnologyDto,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id', ParseIntPipe) technologyId: number, @Body('technology') createTechnologyDto: CreateTechnologyDto): Promise<TechnologyResponseInterface> {
    this.logger.verbose(`Updating technology with id:${technologyId}. Data:${JSON.stringify(createTechnologyDto)}`);
    const technology = await this.technologyService.updateTechnology(technologyId, createTechnologyDto);

    return this.technologyService.buildTechnologyResponse(technology);
  }

  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a technology that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A technology  has been successfuly deleted',
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: 'A technology with given id does not exist',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseIntPipe) technologyId: number) {
    this.logger.verbose(`Deleting technology with id:${technologyId}`);
    return this.technologyService.deleteTechnology(technologyId);
  }
}
