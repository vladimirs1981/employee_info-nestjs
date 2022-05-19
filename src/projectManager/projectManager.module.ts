import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagerController } from '@app/projectManager/projectManager.controller';
import { ProjectManagerService } from '@app/projectManager/projectManager.service';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { UserEntity } from '@app/user/user.entity';
import { CityEntity } from '../city/city.entity';
import { CountryEntity } from '../country/country.entity';
import { ProjectEntity } from '../project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity, UserEntity, CityEntity, CountryEntity, ProjectEntity])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
