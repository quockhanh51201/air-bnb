import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ShareModule } from 'src/shared/shareModule';

@Module({
  imports: [
    JwtModule.register({}),
    ShareModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
