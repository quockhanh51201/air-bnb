import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { datPhongDTO } from './dto/datPhong.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DatPhongService {
    prisma = new PrismaClient()
    async findAll(
        page: number, size: number, keyword: string
    ): Promise<datPhongDTO[]> {
        try {
            let orders = await this.prisma.datPhong.findMany({
                where: keyword
                    ? {
                        ma_phong: {
                            equals: Number(keyword)
                        }
                    }
                    : {},
                skip: (page - 1) * size,
                take: size
            })
            return orders.map(order => plainToClass(datPhongDTO, order))
        } catch (error) {
            throw new Error(error)
        }
    }

    async create(body: datPhongDTO): Promise<string> {
        try {
            const {
                ma_phong, ma_nguoi_dat, ngay_den, ngay_di, so_luong_khach
            } = body
            let order = await this.prisma.datPhong.create({
                data: {
                    ma_phong: Number(ma_phong),
                    ma_nguoi_dat: Number(ma_nguoi_dat),
                    ngay_den: ngay_den,
                    ngay_di: ngay_di,
                    so_luong_khach: Number(so_luong_khach)
                }
            })
            return "Thêm đơn đặt phòng thành công !"
        } catch (error) {
            throw new Error(error)
        }
    }
    async findOne(id: number): Promise<datPhongDTO | null> {
        try {
            const order = await this.prisma.datPhong.findFirst({
                where: { id: id },
            });

            if (!order) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng id: ${id}`);
            }
            return plainToClass(datPhongDTO, order);
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(
        id: number,
        ma_phong?: number,
        ngay_den?: string,
        ngay_di?: string,
        so_luong_khach?: number,
        ma_nguoi_dat?: number,

    ): Promise<datPhongDTO | null> {
        try {
            const order = await this.prisma.datPhong.findFirst({
                where: { id: id },
            });
            if (!order) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng id: ${id}`);
            }
            const dataToUpdate: Partial<datPhongDTO> = {
                ma_phong: ma_phong !== undefined ? ma_phong : order.ma_phong,
                ngay_den: ngay_den !== undefined ? ngay_den : order.ngay_den,
                ngay_di: ngay_di !== undefined ? ngay_di : order.ngay_di,
                so_luong_khach: so_luong_khach !== undefined ? so_luong_khach : order.so_luong_khach,
                ma_nguoi_dat: ma_nguoi_dat !== undefined ? ma_nguoi_dat : order.ma_nguoi_dat,
            };
            Object.keys(dataToUpdate).forEach((key) => {
                if (
                    typeof dataToUpdate[key] === "number" &&
                    isNaN(dataToUpdate[key])
                ) {
                    dataToUpdate[key] = order[key];
                }
            });
            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedLocation = await this.prisma.datPhong.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(datPhongDTO, updatedLocation);
        } catch (error) {
            throw new Error(error)
        }
    }


    async remove(id: number): Promise<string> {
        try {
            const location = await this.prisma.datPhong.findFirst({
                where: { id: id }
            });
            if (!location) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng id: ${id}`);
            }
            await this.prisma.datPhong.delete({
                where: { id: id }
            })
            return "Xóa thành công"
        } catch (error) {
            throw new Error(error)
        }
    }

    async findByIdUser(id: number): Promise<datPhongDTO[] | null> {
        try {
            const order = await this.prisma.datPhong.findMany({
                where: { ma_nguoi_dat: id },
            });

            if (!order) {
                throw new NotFoundException(`Không tìm thấy đơn đặt phòng của người dùng id: ${id}`);
            }
            return plainToClass(datPhongDTO, order);
        } catch (error) {
            throw new Error(error)
        }
    }
}
