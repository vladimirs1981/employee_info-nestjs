import { Module } from '@nestjs/common';
import { ProjectController } from '@app/project/project.controller';
import { ProjectService } from '@app/project/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
