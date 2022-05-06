import { Module } from '@nestjs/common';
import { TechnologyController } from '@app/technology/technology.controller';
import { TechnologyService } from '@app/technology/technology.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyEntity } from '@app/technology/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity])],
  controllers: [TechnologyController],
  providers: [TechnologyService],
})
export class TechnologyModule {}
