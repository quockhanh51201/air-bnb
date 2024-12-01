import { Module } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { BinhLuanController } from './binh-luan.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BinhLuanController],
  providers: [BinhLuanService, JwtStrategy, JwtService],
})
export class BinhLuanModule { }
