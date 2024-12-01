import { Module } from '@nestjs/common';
import { PhongService } from './phong.service';
import { PhongController } from './phong.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ShareModule } from 'src/shared/shareModule';

@Module({
  imports: [ShareModule],
  controllers: [PhongController],
  providers: [PhongService, JwtStrategy, JwtService],
})
export class PhongModule { }
