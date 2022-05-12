import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '@app/user/types/userRole.enum';
import { CityEntity } from '@app/city/city.entity';
import { UserSeniority } from './types/userSeniority.enum';
import { CountryEntity } from '../country/country.entity';
import { TechnologyEntity } from '../technology/technology.entity';
import { ProjectEntity } from '../project/project.entity';
import { NoteEntity } from '../note/note.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Petar' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Petrovic' })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Must be a valid email format and must end with @quantox.com. Also a unique value expected.',
    example: 'petar.petrovic@quantox.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    nullable: true,
  })
  @Column({ default: null })
  googleId: string;

  @ApiProperty({
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @ApiProperty({
    enum: UserSeniority,
  })
  @Column({
    type: 'enum',
    enum: UserSeniority,
    default: UserSeniority.JUNIOR,
  })
  seniority: UserSeniority;

  @ApiProperty()
  @Column({ default: '' })
  plan: string;

  @ManyToOne(() => CityEntity, city => city.users)
  city: CityEntity;

  @ApiProperty()
  @ManyToOne(() => ProjectEntity, project => project.employees)
  project: ProjectEntity;

  @ApiProperty()
  @ManyToMany(() => TechnologyEntity)
  @JoinTable()
  technologies: TechnologyEntity[];

  @ApiProperty()
  @OneToMany(() => NoteEntity, note => note.employee)
  notes: NoteEntity[];
}
