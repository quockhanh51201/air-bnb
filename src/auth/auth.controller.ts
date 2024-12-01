import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDTO } from './dto/register.dto';
import { Response } from 'express';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudUploadService: CloudUploadService
  ) { }

  @Post("/register")
  async register(
    @Body() body: RegisterDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {

      const result = await this.authService.register(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Post("/login")
  async login(
    @Body() body: LoginDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      const result = await this.authService.login(body)
      return res.status(HttpStatus.OK).json({
        message: "Đăng nhập thành công!",
        token: result
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }
}
