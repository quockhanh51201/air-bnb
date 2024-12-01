import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { viTriDTO } from './dto/viTri.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ViTriService {

    prisma = new PrismaClient()
    async findAll(
        page: number, size: number, keyword: string
    ): Promise<viTriDTO[]> {
        try {
            let phongs = await this.prisma.viTri.findMany({
                where: keyword
                    ? {
                        ten_vi_tri: {
                            contains: keyword
                        }
                    }
                    : {},
                skip: (page - 1) * size,
                take: size
            })
            return phongs.map(phong => plainToClass(viTriDTO, phong))
        } catch (error) {
            throw new Error(error)
        }
    }

    async create(body: viTriDTO): Promise<string> {
        try {
            const {
                ten_vi_tri, tinh_thanh, quoc_gia
            } = body
            let userRoom = await this.prisma.viTri.create({
                data: {
                    ten_vi_tri, tinh_thanh, quoc_gia
                }
            })
            return "Thêm vị trí mới thành công !"
        } catch (error) {
            throw new Error(error)
        }
    }
    async findOne(id: number): Promise<viTriDTO | null> {
        try {
            const room = await this.prisma.viTri.findFirst({
                where: { id: id },
            });

            if (!room) {
                throw new NotFoundException(`Không tìm thấy vị trí id: ${id}`);
            }
            return plainToClass(viTriDTO, room);
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(
        id: number,
        ten_vi_tri?: string,
        tinh_thanh?: string,
        quoc_gia?: string,
    ): Promise<viTriDTO | null> {
        try {
            const location = await this.prisma.viTri.findFirst({
                where: { id: id },
            });
            if (!location) {
                throw new NotFoundException(`Không tìm thấy location id: ${id}`);
            }
            const dataToUpdate: Partial<viTriDTO> = {
                ten_vi_tri: ten_vi_tri !== undefined ? ten_vi_tri : location.ten_vi_tri,
                tinh_thanh: tinh_thanh !== undefined ? tinh_thanh : location.tinh_thanh,
                quoc_gia: quoc_gia !== undefined ? quoc_gia : location.quoc_gia,

            };
            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedLocation = await this.prisma.viTri.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(viTriDTO, updatedLocation);
        } catch (error) {
            throw new Error(error)
        }
    }

    async uploadAnh(
        id: number,
        anh: string
    ): Promise<viTriDTO> {
        try {
            const location = await this.prisma.viTri.findFirst({
                where: { id: id }
            });
            if (!location) {
                throw new NotFoundException(`Không tìm thấy location id: ${id}`);
            }
            const updatedlocation = await this.prisma.viTri.update({
                where: { id },
                data: {
                    hinh_anh: anh
                },
            });
            return plainToClass(viTriDTO, updatedlocation);
        } catch (error) {
            throw new Error(error)
        }
    }

    async remove(id: number): Promise<string> {
        try {
            const location = await this.prisma.viTri.findFirst({
                where: { id: id }
            });
            if (!location) {
                throw new NotFoundException(`Không tìm thấy vị trí id: ${id}`);
            }
            await this.prisma.viTri.delete({
                where: { id: id }
            })
            return "Xóa thành công"
        } catch (error) {
            throw new Error(error)
        }
    }
}
