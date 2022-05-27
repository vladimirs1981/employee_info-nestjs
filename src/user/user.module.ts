import { Module } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CityEntity } from '@app/city/city.entity';
import { TechnologyEntity } from '@app/technology/technology.entity';
import { ProjectEntity } from '@app/project/project.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@app/user/guards/roles.guard';
import { TokenEntity } from '@app/token/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CityEntity, TechnologyEntity, ProjectEntity, TokenEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
