import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ required: true, example: 'Running App' })
  @IsNotEmpty()
  readonly name: string;
}
