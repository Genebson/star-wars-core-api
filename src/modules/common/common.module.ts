import { Module } from '@nestjs/common';
import { JwtStrategy } from './controller/jwt/jwt.strategy';
import { EncryptService } from './service/encrypt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JwtStrategy, EncryptService],
  exports: [EncryptService],
})
export class CommonModule {}
