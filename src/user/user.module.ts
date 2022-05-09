import { Module } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { CityEntity } from '../city/city.entity';
import { TechnologyEntity } from '../technology/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CityEntity, TechnologyEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
