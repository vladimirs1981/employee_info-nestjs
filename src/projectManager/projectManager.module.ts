import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagerController } from './projectManager.controller';
import { ProjectManagerService } from './projectManager.service';
import { TechnologyEntity } from '../technology/technology.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity, UserEntity])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
