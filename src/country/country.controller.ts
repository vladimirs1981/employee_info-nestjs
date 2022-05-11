import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CountryService } from './country.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { CreateCountryDto } from './dto/createCountry.dto';
import { CountryResponseInterface } from './types/countryResponse.interface';
import { CountryEntity } from '@app/country/country.entity';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('countries')
@ApiTags('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<{ countries: CountryEntity[] }> {
    const countries = await this.countryService.findAll();
    return {
      countries,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id') countryId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.findCountryById(countryId);
    return this.countryService.buildCountryResponse(country);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('country') createCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.createCountry(createCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCountry(@Param('id') countryId: number, @Body('country') updateCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.updateCountry(countryId, updateCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCountry(@Param('id') countryId: number) {
    return this.countryService.deleteCountry(countryId);
  }

  @Post(':countryId/city/:cityId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async addCityToCountry(@Param('countryId', ParseIntPipe) countryId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.addCityToCountry(countryId, cityId);

    return this.countryService.buildCountryResponse(country);
  }

  @Delete(':countryId/city/:cityId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCityFromCountry(@Param('countryId', ParseIntPipe) countryId: number, @Param('cityId', ParseIntPipe) cityId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.deleteCityFromCountry(countryId, cityId);

    return this.countryService.buildCountryResponse(country);
  }
}
