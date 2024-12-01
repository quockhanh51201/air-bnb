import { Module } from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { ViTriController } from './vi-tri.controller';
import { ShareModule } from 'src/shared/shareModule';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ShareModule],
  controllers: [ViTriController],
  providers: [ViTriService, JwtStrategy, JwtService],
})
export class ViTriModule { }
