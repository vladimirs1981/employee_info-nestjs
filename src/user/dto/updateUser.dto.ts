import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Petar' })
  readonly firstName: string;

  @ApiProperty({ example: 'Petrovic' })
  readonly lastName: string;

  @ApiProperty({
    description: 'Must be a valid email format and must end with @quantox.com. Also a unique value expected.',
    example: 'petar.petrovic@quantox.com',
  })
  @IsEmail()
  @Contains('@quantox.com')
  readonly email: string;

  @ApiProperty({ example: 'This is user plan' })
  readonly plan: string;
}
