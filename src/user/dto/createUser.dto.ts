import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'Must be a valid email format and must end with @quantox.com. Also a unique value expected.',
    example: 'test@quantox.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Contains('@quantox.com')
  readonly email: string;
}
