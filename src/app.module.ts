import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from './config/database.config';
import { DataSource } from 'typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MovieModule } from './modules/movie/movie.module';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { environmentConfig } from './config/environment.config';
import { environmentValidation } from './config/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
      validationSchema: environmentValidation,
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    AuthModule,
    UserModule,
    MovieModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
