import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CityService } from '@app/city/city.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCityDto } from './dto/createCity.dto';
import { CityResponseInterface } from './types/cityResponse.interface';
import { CityEntity } from './city.entity';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<{ cities: CityEntity[] }> {
    const cities = await this.cityService.findAllCities();
    return { cities };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<CityResponseInterface> {
    const city = await this.cityService.findCityById(id);
    return this.cityService.buildCityResponse(city);
  }

  @Post(':countryId')
  @UseGuards(AuthGuard)
  async create(@Body('city') createCityDto: CreateCityDto, @Param('countryId', ParseIntPipe) countryId: number): Promise<CityResponseInterface> {
    const city = await this.cityService.createCity(createCityDto, countryId);
    return this.cityService.buildCityResponse(city);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCity(@Param('id', ParseIntPipe) cityId: number, @Body('city') updateCityDto: CreateCityDto): Promise<CityResponseInterface> {
    const city = await this.cityService.updateCity(cityId, updateCityDto);
    return this.cityService.buildCityResponse(city);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCity(@Param('id', ParseIntPipe) cityId: number) {
    return this.cityService.deleteCity(cityId);
  }
}
