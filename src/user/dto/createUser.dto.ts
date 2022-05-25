import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'Petar' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ required: true, example: 'Petrovic' })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    required: true,
    description: 'Must be a valid email format and must end with @quantox.com. Also a unique value expected.',
    example: 'petar.petrovic@quantox.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Contains('@quantox.com')
  readonly email: string;
}
