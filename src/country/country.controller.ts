import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CountryService } from '@app/country/country.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCountryDto } from '@app/country/dto/createCountry.dto';
import { CountryResponseInterface } from '@app/country/types/countryResponse.interface';
import { CountryEntity } from '@app/country/country.entity';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('countries')
@ApiBearerAuth('defaultBearerAuth')
@ApiTags('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({ type: [CountryEntity] })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
  async findAll(): Promise<{ countries: CountryEntity[] }> {
    const countries = await this.countryService.findAll();
    return {
      countries,
    };
  }

  @Get(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a country that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A country has been successfuly fetched',
  })
  @ApiResponse({
    status: 404,
    description: 'A country with given id does not exist',
  })
  @ApiOkResponse({ type: CountryEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id') countryId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.findCountryById(countryId);
    return this.countryService.buildCountryResponse(country);
  }

  @Post()
  @ApiBearerAuth('defaultBearerAuth')
  @ApiBody({
    type: CreateCountryDto,
  })
  @ApiCreatedResponse({ type: CountryEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('country') createCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.createCountry(createCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Put(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a country that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A country name has been successfuly updated',
  })
  @ApiResponse({
    status: 404,
    description: 'A country with given id does not exist',
  })
  @ApiBody({
    description: 'name is required',
    type: CreateCountryDto,
  })
  @ApiCreatedResponse({ type: CountryEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCountry(@Param('id') countryId: number, @Body('country') updateCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.updateCountry(countryId, updateCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a country that exists in the database',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A country  has been successfuly deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'A country with given id does not exist',
  })
  @ApiOkResponse({ type: DeleteResult })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCountry(@Param('id') countryId: number) {
    return this.countryService.deleteCountry(countryId);
  }

  @Post(':countryId/city/:cityId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'countryId',
    required: true,
    description: 'Should be an id of a country that exists in the database',
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
    description: 'A city has been successfuly added to country',
  })
  @ApiResponse({
    status: 404,
    description: 'A country or city with given id does not exist',
  })
  @ApiOkResponse({ type: CountryEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addCityToCountry(@Param('countryId', ParseIntPipe) countryId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.addCityToCountry(countryId, cityId);

    return this.countryService.buildCountryResponse(country);
  }

  @Delete(':countryId/city/:cityId')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiParam({
    name: 'countryId',
    required: true,
    description: 'Should be an id of a country that exists in the database',
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
    description: 'A city has been successfuly removed from country',
  })
  @ApiResponse({
    status: 404,
    description: 'A country or city with given id does not exist',
  })
  @ApiOkResponse({ type: CountryEntity })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCityFromCountry(@Param('countryId', ParseIntPipe) countryId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.deleteCityFromCountry(countryId, cityId);

    return this.countryService.buildCountryResponse(country);
  }
}
