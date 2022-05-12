import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ required: true, example: 'New York' })
  @IsNotEmpty()
  readonly name: string;
}
