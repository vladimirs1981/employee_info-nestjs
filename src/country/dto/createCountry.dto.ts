import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ required: true, example: 'USA' })
  @IsNotEmpty()
  readonly name: string;
}
