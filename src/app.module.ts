import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CountryModule } from '@app/country/country.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from '@app/user/middlewares/auth.middleware';
import { CityModule } from '@app/city/city.module';
import { TechnologyModule } from '@app/technology/techology.module';
import { ProjectModule } from '@app/project/project.module';
import { ProjectManagerModule } from '@app/projectManager/projectManager.module';
import { NoteModule } from '@app/note/note.module';
import ormconfig from '@app/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CountryModule,
    CityModule,
    UserModule,
    AuthModule,
    TechnologyModule,
    ProjectModule,
    ProjectManagerModule,
    NoteModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
