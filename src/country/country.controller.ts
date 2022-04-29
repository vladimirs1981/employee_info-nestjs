import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
  @Get()
  async findAll(): Promise<{ countries: string[] }> {
    const countries = await this.countryService.findAll();
    return {
      countries: countries.map(country => country.name),
    };
  }
}
