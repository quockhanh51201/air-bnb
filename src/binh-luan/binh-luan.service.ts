import { Injectable, NotFoundException } from '@nestjs/common';
import { binhLuanDTO } from './dto/binhLuan.dto';
import { plainToClass } from 'class-transformer';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BinhLuanService {
    prisma = new PrismaClient()
    async findAll(): Promise<binhLuanDTO[]> {
        try {
            let comments = await this.prisma.binhLuan.findMany()
            return comments.map(comment => plainToClass(binhLuanDTO, comment))
        } catch (error) {
            throw new Error(error)
        }
    }

    async create(body: binhLuanDTO): Promise<string> {
        try {
            const {
                ma_cong_viec, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan
            } = body
            let comment = await this.prisma.binhLuan.create({
                data: {
                    ma_cong_viec: Number(ma_cong_viec),
                    ma_nguoi_binh_luan: Number(ma_nguoi_binh_luan),
                    ngay_binh_luan: ngay_binh_luan,
                    noi_dung: noi_dung,
                    sao_binh_luan: Number(sao_binh_luan)
                }
            })
            return "Thêm bình luận thành công !"
        } catch (error) {
            throw new Error(error)
        }
    }
    async findOne(id: number): Promise<binhLuanDTO | null> {
        try {
            const comment = await this.prisma.binhLuan.findFirst({
                where: { id: id },
            });

            if (!comment) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng id: ${id}`);
            }
            return plainToClass(binhLuanDTO, comment);
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(
        id: number,
        ma_cong_viec?: number,
        ma_nguoi_binh_luan?: number,
        ngay_binh_luan?: string,
        noi_dung?: string,
        sao_binh_luan?: number,

    ): Promise<binhLuanDTO | null> {
        try {
            const comment = await this.prisma.binhLuan.findFirst({
                where: { id: id },
            });
            if (!comment) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng id: ${id}`);
            }
            const dataToUpdate: Partial<binhLuanDTO> = {
                ma_cong_viec: ma_cong_viec !== undefined ? ma_cong_viec : comment.ma_cong_viec,
                ma_nguoi_binh_luan: ma_nguoi_binh_luan !== undefined ? ma_nguoi_binh_luan : comment.ma_nguoi_binh_luan,
                ngay_binh_luan: ngay_binh_luan !== undefined ? ngay_binh_luan : comment.ngay_binh_luan,
                noi_dung: noi_dung !== undefined ? noi_dung : comment.noi_dung,
                sao_binh_luan: sao_binh_luan !== undefined ? sao_binh_luan : comment.sao_binh_luan,
            };
            Object.keys(dataToUpdate).forEach((key) => {
                if (
                    typeof dataToUpdate[key] === "number" &&
                    isNaN(dataToUpdate[key])
                ) {
                    dataToUpdate[key] = comment[key];
                }
            });
            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedLocation = await this.prisma.binhLuan.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(binhLuanDTO, updatedLocation);
        } catch (error) {
            throw new Error(error)
        }
    }


    async remove(id: number): Promise<string> {
        try {
            const location = await this.prisma.binhLuan.findFirst({
                where: { id: id }
            });
            if (!location) {
                throw new NotFoundException(`Không tìm thấy bình luận id: ${id}`);
            }
            await this.prisma.binhLuan.delete({
                where: { id: id }
            })
            return "Xóa thành công"
        } catch (error) {
            throw new Error(error)
        }
    }

    async findByIdRoom(id: number): Promise<binhLuanDTO[] | null> {
        try {
            const comment = await this.prisma.binhLuan.findMany({
                where: { ma_cong_viec: id },
            });

            if (!comment) {
                throw new NotFoundException(`Không tìm thấy bình luận của phòng id: ${id}`);
            }
            return plainToClass(binhLuanDTO, comment);
        } catch (error) {
            throw new Error(error)
        }
    }
}
