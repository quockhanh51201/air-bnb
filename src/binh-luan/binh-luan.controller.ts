import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { binhLuanDTO } from './dto/binhLuan.dto';

@Controller('binh-luan')
export class BinhLuanController {
  constructor(
    private readonly binhLuanService: BinhLuanService,
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

  @Get("/get-comments")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async getRooms(
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ) {
    let token = authorization.split(' ')[1];
    const tokenDecode = this.checkToken(token, res)
    try {
      let comments = await this.binhLuanService.findAll();
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách bình luận thành công!",
        data: comments
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Post("/create-comment")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async create(
    @Headers("authorization") authorization: string,
    @Body() body: binhLuanDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      let token = authorization.split(' ')[1];
      const tokenDecode = this.checkToken(token, res)
      const result = await this.binhLuanService.create(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Put('/update-comment/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "ma_cong_viec", required: false, type: Number })
  @ApiQuery({ name: "ma_nguoi_binh_luan", required: false, type: Number })
  @ApiQuery({ name: "ngay_binh_luan", required: false, type: String })
  @ApiQuery({ name: "noi_dung", required: false, type: String })
  @ApiQuery({ name: "sao_binh_luan", required: false, type: Number })
  @ApiHeader({ name: "authorization", required: false })
  async update(
    @Param('id') id: Number,
    @Query('ma_cong_viec') ma_cong_viec: Number,
    @Query('ma_nguoi_binh_luan') ma_nguoi_binh_luan: Number,
    @Query('ngay_binh_luan') ngay_binh_luan: string,
    @Query('noi_dung') noi_dung: string,
    @Query('sao_binh_luan') sao_binh_luan: number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let comment = await this.binhLuanService.update(
        Number(id),
        Number(ma_cong_viec),
        Number(ma_nguoi_binh_luan),
        ngay_binh_luan,
        noi_dung,
        Number(sao_binh_luan)
      );
      return res.status(HttpStatus.OK).json({
        message: "Update comment by id thành công!",
        data: comment
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Delete('/delete-comment/:id')
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
      const result = await this.binhLuanService.remove(Number(id));
      return res.status(HttpStatus.OK).json({
        message: result
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-commnet-by-id-phong/:id')
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
      let comments = await this.binhLuanService.findByIdRoom(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get đặt phòng by id phòng thành công!",
        data: comments
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
}
