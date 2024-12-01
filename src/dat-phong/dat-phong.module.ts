import { Module } from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { DatPhongController } from './dat-phong.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DatPhongController],
  providers: [DatPhongService, JwtStrategy, JwtService],
})
export class DatPhongModule { }
