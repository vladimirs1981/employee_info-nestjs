import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EmployeeFilterDto {
  @IsOptional()
  @IsString()
  readonly search: string;

  @IsOptional()
  @IsString()
  readonly city: string;

  @IsOptional()
  @IsString()
  readonly country: string;

  @IsOptional()
  @IsString()
  readonly technology: string;

  @IsOptional()
  @IsString()
  readonly seniority: string;

  @IsOptional()
  @IsString()
  readonly project: string;

  @IsOptional()
  @IsNumber()
  readonly projectManager: number;

  @IsOptional()
  @IsString()
  readonly page: string;
}
