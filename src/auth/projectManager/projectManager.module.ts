import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';
import { ProjectManagerController } from './projectManager.controller';
import { ProjectManagerService } from './projectManager.service';
import { CityEntity } from '../../city/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CityEntity])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
