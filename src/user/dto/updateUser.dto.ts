import { Contains, IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly firstName: string;

  readonly lastName: string;

  @IsEmail()
  @Contains('@quantox.com')
  readonly email: string;

  readonly plan: string;
}
