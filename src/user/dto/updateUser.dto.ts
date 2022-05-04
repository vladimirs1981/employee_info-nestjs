import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly firstName: string;

  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  readonly plan: string;
}
