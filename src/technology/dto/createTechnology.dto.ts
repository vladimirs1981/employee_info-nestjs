import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ required: true, example: 'NodeJS' })
  @IsNotEmpty()
  readonly name: string;
}
