import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { datPhongDTO } from './dto/datPhong.dto';

@Controller('dat-phong')
export class DatPhongController {
  constructor(
    private readonly datPhongService: DatPhongService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  @Get("/get-orders")
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
      let rooms = await this.datPhongService.findAll(formatPage, formatSize, keyword);
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách đặt phòng thành công!",
        data: rooms
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
  @Get('/get-order/:id')
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
      let order = await this.datPhongService.findOne(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get đặt phòng by id thành công!",
        data: order
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Post("/create-order")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async create(
    @Headers("authorization") authorization: string,
    @Body() body: datPhongDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      let token = authorization.split(' ')[1];
      const tokenDecode = this.checkToken(token, res)
      const result = await this.datPhongService.create(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Put('/update-order/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "ma_phong", required: false, type: Number })
  @ApiQuery({ name: "ngay_den", required: false, type: String })
  @ApiQuery({ name: "ngay_di", required: false, type: String })
  @ApiQuery({ name: "so_luong_khach", required: false, type: String })
  @ApiQuery({ name: "ma_nguoi_dat", required: false, type: Number })

  @ApiHeader({ name: "authorization", required: false })
  async update(
    @Param('id') id: Number,
    @Query('ma_phong') ma_phong: Number,
    @Query('ngay_den') ngay_den: string,
    @Query('ngay_di') ngay_di: string,
    @Query('so_luong_khach') so_luong_khach: number,
    @Query('ma_nguoi_dat') ma_nguoi_dat: number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let order = await this.datPhongService.update(
        Number(id),
        Number(ma_phong),
        ngay_den,
        ngay_di,
        Number(so_luong_khach),
        Number(ma_nguoi_dat)
      );
      return res.status(HttpStatus.OK).json({
        message: "Update đặt phòng by id thành công!",
        data: order
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Delete('/delete-order/:id')
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
      const result = await this.datPhongService.remove(Number(id));
      return res.status(HttpStatus.OK).json({
        message: result
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-order-by-id-nguoi-dung/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async findByIdUser(
    @Param('id') id: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let order = await this.datPhongService.findByIdUser(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get đặt phòng by id người dùng thành công!",
        data: order
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
}
