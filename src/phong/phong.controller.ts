import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PhongService } from './phong.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { phongDTO } from './dto/phong.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('phong')
export class PhongController {
  constructor(
    private readonly phongService: PhongService,
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

  @Get("/get-rooms")
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
      let rooms = await this.phongService.findAll(formatPage, formatSize, keyword);
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách phòng thành công!",
        data: rooms
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get("/get-rooms-by-location/:id_location")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async getRoomsByLocation(
    @Param('id_location') idLoacation: Number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ) {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    try {
      let rooms = await this.phongService.findByLocation(Number(idLoacation));
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách phòng theo vị trí thành công!",
        data: rooms
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-room/:id')
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
      let user = await this.phongService.findOne(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get room by id thành công!",
        data: user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Post("/create-room")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async create(
    @Headers("authorization") authorization: string,
    @Body() body: phongDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      let token = authorization.split(' ')[1];
      const tokenDecode = this.checkToken(token, res)
      const result = await this.phongService.create(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Put('/update-room/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "ten_phong", required: false, type: String })
  @ApiQuery({ name: "khach", required: false, type: Number })
  @ApiQuery({ name: "phong_ngu", required: false, type: Number })
  @ApiQuery({ name: "giuong", required: false, type: Number })
  @ApiQuery({ name: "phong_tam", required: false, type: Number })
  @ApiQuery({ name: "mo_ta", required: false, type: String })
  @ApiQuery({ name: "gia_tien", required: false, type: Number })
  @ApiQuery({ name: "may_giat", required: false, type: Boolean })
  @ApiQuery({ name: "ban_la", required: false, type: Boolean })
  @ApiQuery({ name: "tivi", required: false, type: Boolean })
  @ApiQuery({ name: "dieu_hoa", required: false, type: Boolean })
  @ApiQuery({ name: "wifi", required: false, type: Boolean })
  @ApiQuery({ name: "bep", required: false, type: Boolean })
  @ApiQuery({ name: "do_xe", required: false, type: Boolean })
  @ApiQuery({ name: "ho_boi", required: false, type: Boolean })
  @ApiQuery({ name: "ban_ui", required: false, type: Boolean })
  @ApiQuery({ name: "vi_tri_id", required: false, type: Number })
  @ApiHeader({ name: "authorization", required: false })
  async update(
    @Param('id') id: Number,
    @Query('ten_phong') ten_phong: string,
    @Query('khach') khach: Number,
    @Query('phong_ngu') phong_ngu: Number,
    @Query('giuong') giuong: Number,
    @Query('phong_tam') phong_tam: Number,
    @Query('mo_ta') mo_ta: string,
    @Query('gia_tien') gia_tien: Number,
    @Query('may_giat') may_giat: Boolean,
    @Query('ban_la') ban_la: Boolean,
    @Query('tivi') tivi: Boolean,
    @Query('dieu_hoa') dieu_hoa: Boolean,
    @Query('wifi') wifi: Boolean,
    @Query('bep') bep: Boolean,
    @Query('do_xe') do_xe: Boolean,
    @Query('ho_boi') ho_boi: Boolean,
    @Query('ban_ui') ban_ui: Boolean,
    @Query('vi_tri_id') vi_tri_id: Number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let room = await this.phongService.update(
        Number(id),
        ten_phong,
        Number(khach),
        Number(phong_ngu),
        Number(giuong),
        Number(phong_tam),
        mo_ta,
        Number(gia_tien),
        Boolean(may_giat),
        Boolean(ban_la),
        Boolean(tivi),
        Boolean(dieu_hoa),
        Boolean(wifi),
        Boolean(bep),
        Boolean(do_xe),
        Boolean(ho_boi),
        Boolean(ban_ui),
        Number(vi_tri_id)
      );
      return res.status(HttpStatus.OK).json({
        message: "Update room by id thành công!",
        data: room
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Put('/upload-hinh-phong/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        anh_phong: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh phòng',
        },
      },
      required: ['anh_phong']
    }
  })
  @UseInterceptors(FileInterceptor('anh_phong'))
  @ApiHeader({ name: "authorization", required: false })
  async uploadAvatar(
    @Headers("authorization") authorization: string,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: Number,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    const anh = await this.cloudUploadService.uploadImage(file, 'anhPhong')
    try {
      let room = await this.phongService.uploadAnh(Number(id), anh.url);
      return res.status(HttpStatus.OK).json({
        message: "Upload ảnh phòng thành công!",
        data: room
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Delete('/delete-room/:id')
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
      const result = await this.phongService.remove(Number(id));
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
