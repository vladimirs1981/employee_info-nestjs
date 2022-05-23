import { ApiProperty } from '@nestjs/swagger';
import { BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';

@Entity({
  name: 'projects',
})
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: true, example: 'Running App' })
  @Column({
    unique: true,
  })
  name: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
  @ApiProperty()
  @OneToMany(() => UserEntity, user => user.project)
  employees: UserEntity[];

  @OneToOne(() => UserEntity, user => user.pm_project, { eager: true })
  @JoinColumn()
  projectManager: UserEntity;
}
