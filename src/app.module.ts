import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AppRepo} from "./app.repo";

@Module({
  controllers: [AppController],
  providers: [AppService, AppRepo],
})
export class AppModule {}
