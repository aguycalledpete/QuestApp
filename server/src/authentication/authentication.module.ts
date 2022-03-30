import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthenticationGuard } from './guards/jwt.guard';
import { AuthenticationService } from './service/authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' }
      })
    })
  ],
  providers: [
    AuthenticationService,
    JwtStrategy,
    JwtAuthenticationGuard
  ],
  exports: [
    AuthenticationService
  ]
})
export class AuthenticationModule { }
