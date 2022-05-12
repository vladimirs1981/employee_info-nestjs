import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagerController } from '@app/projectManager/projectManager.controller';
import { ProjectManagerService } from '@app/projectManager/projectManager.service';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity, UserEntity])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
