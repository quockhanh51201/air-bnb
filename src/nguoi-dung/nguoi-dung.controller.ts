import { Controller, Delete, Get, Headers, HttpStatus, Param, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class NguoiDungController {
  constructor(
    private readonly nguoiDungService: NguoiDungService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cloudUploadService: CloudUploadService
  ) { }
  checkToken(token: string, res: Response) {
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Token không được cung cấp"
      });
    }
    try {
      return this.jwtService.verify(token, { secret: this.configService.get<string>('SECRET_KEY') });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: `Token không hợp lệ, ${err.name}`
      });
    }
  }

  @Get("/get-user")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async getUser(
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ) {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    try {
      let user = await this.nguoiDungService.getUser(Number(tokenDecode.data.user_id));
      return res.status(HttpStatus.OK).json({
        message: "Get thông tin user thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get("/get-users")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "keyword", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async getUsers(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ) {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    try {
      const formatPage = page ? Number(page) : 1
      const formatSize = size ? Number(size) : 10
      let users = await this.nguoiDungService.findAll(formatPage, formatSize, keyword);
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách user thành công!",
        data: users
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Delete('/delete-user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async remove(
    @Param('id') id: Number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      const result = await this.nguoiDungService.remove(Number(id));
      return res.status(HttpStatus.OK).json({
        message: result
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async findOne(
    @Param('id') id: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let user = await this.nguoiDungService.findOne(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get người dùng by id thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-user/search/:name')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async findOneByName(
    @Param('name') name: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let user = await this.nguoiDungService.findOneByName(name);
      return res.status(HttpStatus.OK).json({
        message: "Get người dùng by name thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Put('/update-user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "name", required: false, type: String })
  @ApiQuery({ name: "phone", required: false, type: String })
  @ApiQuery({ name: "birthday", required: false, type: String })
  @ApiQuery({ name: "gender", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async update(
    @Param('id') id: string,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('birthday') birthday: string,
    @Query('gender') gender: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let user = await this.nguoiDungService.update(Number(id), name, phone, birthday, gender);
      return res.status(HttpStatus.OK).json({
        message: "Update người dùng by id thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Put('/upload-avatar-user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh đại diện của người dùng',
        },
      },
      required: ['avatar']
    }
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiHeader({ name: "authorization", required: false })
  async uploadAvatar(
    @Headers("authorization") authorization: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    const avt = await this.cloudUploadService.uploadImage(file, 'avatar')
    try {
      let user = await this.nguoiDungService.uploadAvatar(Number(tokenDecode.data.user_id), avt.url);
      return res.status(HttpStatus.OK).json({
        message: "Upload avatart người dùng thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Put('/update-role-user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "name", required: false, type: String })
  @ApiQuery({ name: "phone", required: false, type: String })
  @ApiQuery({ name: "birthday", required: false, type: String })
  @ApiQuery({ name: "gender", required: false, type: String })
  @ApiQuery({ name: "role", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async updateRole(
    @Param('id') id: string,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('birthday') birthday: string,
    @Query('gender') gender: string,
    @Query('role') role: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let user = await this.nguoiDungService.updateRole(Number(id), name, phone, birthday, gender, role);
      return res.status(HttpStatus.OK).json({
        message: "Update người dùng by id thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
}
