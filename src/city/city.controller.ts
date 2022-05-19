import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Logger } from '@nestjs/common';
import { CityService } from '@app/city/city.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCityDto } from '@app/city/dto/createCity.dto';
import { CityResponseInterface } from '@app/city/types/cityResponse.interface';
import { CityEntity } from '@app/city/city.entity';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('cities')
@ApiTags('cities')
export class CityController {
  private logger = new Logger('CityController');
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [CityEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async findAll(): Promise<{ cities: CityEntity[] }> {
    this.logger.verbose('Retrieving all cities');
    const cities = await this.cityService.findAllCities();
    return { cities };
  }

  @Get(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a city that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A city has been successfuly fetched',
    type: CityEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A city with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<CityResponseInterface> {
    this.logger.verbose(`Retrieving city with the id:${JSON.stringify(id)}`);
    const city = await this.cityService.findCityById(id);
    return this.cityService.buildCityResponse(city);
  }

  @Post()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateCityDto,
  })
  @ApiCreatedResponse({ type: CityEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('city') createCityDto: CreateCityDto): Promise<CityResponseInterface> {
    this.logger.verbose(`Creating a new city. Data: ${JSON.stringify(createCityDto)}`);
    const city = await this.cityService.createCity(createCityDto);
    return this.cityService.buildCityResponse(city);
  }

  @Put(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a city that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A city name has been successfuly updated',
    type: CityEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'A city with given id does not exist',
  })
  @ApiBody({
    description: 'name is required',
    type: CreateCityDto,
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCity(@Param('id', ParseIntPipe) cityId: number, @Body('city') updateCityDto: CreateCityDto): Promise<CityResponseInterface> {
    this.logger.verbose(`Updating a city. Data: ${JSON.stringify(updateCityDto)}`);
    const city = await this.cityService.updateCity(cityId, updateCityDto);
    return this.cityService.buildCityResponse(city);
  }

  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a city that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A city  has been successfuly deleted',
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: 'A city with given id does not exist',
  })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCity(@Param('id', ParseIntPipe) cityId: number) {
    this.logger.verbose(`Deleting city with the id:${cityId}`);
    return this.cityService.deleteCity(cityId);
  }
}
