import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ required: true, example: 'This is note text' })
  @IsNotEmpty()
  readonly text: string;
}
