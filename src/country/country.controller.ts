import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CountryService } from './country.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { CreateCountryDto } from './dto/createCountry.dto';
import { CountryResponseInterface } from './types/countryResponse.interface';
import { CountryEntity } from '@app/country/country.entity';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<{ countries: CountryEntity[] }> {
    const countries = await this.countryService.findAll();
    return {
      countries,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') countryId: number): Promise<CountryResponseInterface> {
    const country = await this.countryService.findCountryById(countryId);
    return this.countryService.buildCountryResponse(country);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body('country') createCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.createCountry(createCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCountry(@Param('id') countryId: number, @Body('country') updateCountryDto: CreateCountryDto): Promise<CountryResponseInterface> {
    const country = await this.countryService.updateCountry(countryId, updateCountryDto);
    return this.countryService.buildCountryResponse(country);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCountry(@Param('id') countryId: number) {
    return this.countryService.deleteCountry(countryId);
  }
}
