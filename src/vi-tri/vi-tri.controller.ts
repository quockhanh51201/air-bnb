import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { viTriDTO } from './dto/viTri.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vi-tri')
export class ViTriController {
  constructor(
    private readonly viTriService: ViTriService,
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

  @Get("/get-locations")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "keyword", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async getRooms(
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
      let locations = await this.viTriService.findAll(formatPage, formatSize, keyword);
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách vị trí thành công!",
        data: locations
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
  @Get('/get-location/:id')
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
      let user = await this.viTriService.findOne(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get location by id thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Post("/create-location")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async create(
    @Headers("authorization") authorization: string,
    @Body() body: viTriDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      let token = authorization.split(' ')[1];
      const tokenDecode = this.checkToken(token, res)
      const result = await this.viTriService.create(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Put('/update-location/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "ten_vi_tri", required: false, type: String })
  @ApiQuery({ name: "tinh_thanh", required: false, type: String })
  @ApiQuery({ name: "quoc_gia", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async update(
    @Param('id') id: Number,
    @Query('ten_vi_tri') ten_vi_tri: string,
    @Query('tinh_thanh') tinh_thanh: string,
    @Query('quoc_gia') quoc_gia: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let room = await this.viTriService.update(
        Number(id),
        ten_vi_tri,
        tinh_thanh,
        quoc_gia
      );
      return res.status(HttpStatus.OK).json({
        message: "Update vị trí by id thành công!",
        data: room
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Put('/upload-hinh-vi-tri/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        anh_vi_tri: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh vị trí',
        },
      },
      required: ['anh_vi_tri']
    }
  })
  @UseInterceptors(FileInterceptor('anh_vi_tri'))
  @ApiHeader({ name: "authorization", required: false })
  async uploadAvatar(
    @Headers("authorization") authorization: string,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: Number,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    const anh = await this.cloudUploadService.uploadImage(file, 'anhViTri')
    try {
      let location = await this.viTriService.uploadAnh(Number(id), anh.url);
      return res.status(HttpStatus.OK).json({
        message: "Upload ảnh phòng thành công!",
        data: location
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Delete('/delete-location/:id')
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
      const result = await this.viTriService.remove(Number(id));
      return res.status(HttpStatus.OK).json({
        message: result
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
}
