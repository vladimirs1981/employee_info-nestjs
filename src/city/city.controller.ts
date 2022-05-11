import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CityService } from '@app/city/city.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCityDto } from './dto/createCity.dto';
import { CityResponseInterface } from './types/cityResponse.interface';
import { CityEntity } from './city.entity';
import { Roles } from '@app/user/decorators/userRoles.decorator';
import { UserRole } from '@app/user/types/userRole.enum';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<{ cities: CityEntity[] }> {
    const cities = await this.cityService.findAllCities();
    return { cities };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<CityResponseInterface> {
    const city = await this.cityService.findCityById(id);
    return this.cityService.buildCityResponse(city);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body('city') createCityDto: CreateCityDto): Promise<CityResponseInterface> {
    const city = await this.cityService.createCity(createCityDto);
    return this.cityService.buildCityResponse(city);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateCity(@Param('id', ParseIntPipe) cityId: number, @Body('city') updateCityDto: CreateCityDto): Promise<CityResponseInterface> {
    const city = await this.cityService.updateCity(cityId, updateCityDto);
    return this.cityService.buildCityResponse(city);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteCity(@Param('id', ParseIntPipe) cityId: number) {
    return this.cityService.deleteCity(cityId);
  }
}
