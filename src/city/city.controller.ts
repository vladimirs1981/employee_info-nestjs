import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CityService } from '@app/city/city.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CreateCityDto } from './dto/createCity.dto';
import { CityResponseInterface } from './types/cityResponse.interface';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post(':countryId')
  @UseGuards(AuthGuard)
  async create(@Body('city') createCityDto: CreateCityDto, @Param('countryId', ParseIntPipe) countryId: number): Promise<CityResponseInterface> {
    const city = await this.cityService.createCity(createCityDto, countryId);
    return this.cityService.buildCityResponse(city);
  }
}
