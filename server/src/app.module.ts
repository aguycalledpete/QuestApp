import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserHelperService } from './user/service/user-helper/user-helper.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthenticationModule,
    ChatModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    UserHelperService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/server/user', method: RequestMethod.POST },
        { path: '/server/user/login', method: RequestMethod.POST },
        { path: '/server/user/find-one-by-email', method: RequestMethod.GET },
        { path: '/server/user/find-forgot-user-by-email', method: RequestMethod.GET },
        { path: '/server/user/answer-question', method: RequestMethod.POST },
        { path: '/server/user/reset-password', method: RequestMethod.POST }
      )
      .forRoutes('');
  }
}
