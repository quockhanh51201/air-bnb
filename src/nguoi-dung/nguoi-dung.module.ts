import { Module } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { ShareModule } from 'src/shared/shareModule';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ShareModule],
  controllers: [NguoiDungController],
  providers: [NguoiDungService, JwtStrategy, JwtService],
})
export class NguoiDungModule { }
