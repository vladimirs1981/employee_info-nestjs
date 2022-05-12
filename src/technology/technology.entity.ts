import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'technologies' })
export class TechnologyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: true, example: 'NodeJS' })
  @Column({
    unique: true,
  })
  name: string;
}
