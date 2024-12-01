import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { phongDTO } from './dto/phong.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PhongService {
    prisma = new PrismaClient()
    async findAll(
        page: number, size: number, keyword: string
    ): Promise<phongDTO[]> {
        try {
            let phongs = await this.prisma.phong.findMany({
                where: keyword
                    ? {
                        ten_phong: {
                            contains: keyword
                        }
                    }
                    : {},
                skip: (page - 1) * size,
                take: size
            })
            return phongs.map(phong => plainToClass(phongDTO, phong))
        } catch (error) {
            throw new Error(error)
        }
    }

    async create(body: phongDTO): Promise<string> {
        try {
            const {
                ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, vi_tri_id
            } = body
            let userRoom = await this.prisma.phong.create({
                data: {
                    ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, vi_tri_id
                }
            })
            return "Thêm phòng thành công !"
        } catch (error) {
            throw new Error(error)
        }
    }

    async findByLocation(idLocation: number): Promise<phongDTO[] | null> {
        try {
            const rooms = await this.prisma.phong.findMany({
                where: { vi_tri_id: idLocation },
            });
            if (!rooms || rooms.length === 0) {
                throw new NotFoundException(`Không tìm thấy phòng có id: ${idLocation}`);
            }
            return plainToClass(phongDTO, rooms);
        } catch (error) {
            throw new Error(error)
        }
    }

    async findOne(id: number): Promise<phongDTO | null> {
        try {
            const room = await this.prisma.phong.findFirst({
                where: { id: id },
            });

            if (!room) {
                throw new NotFoundException(`Không tìm thấy phòng id: ${id}`);
            }
            return plainToClass(phongDTO, room);
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(
        id: number,
        ten_phong?: string,
        khach?: number,
        phong_ngu?: number,
        giuong?: number,
        phong_tam?: number,
        mo_ta?: string,
        gia_tien?: number,
        may_giat?: boolean,
        ban_la?: boolean,
        tivi?: boolean,
        dieu_hoa?: boolean,
        wifi?: boolean,
        bep?: boolean,
        do_xe?: boolean,
        ho_boi?: boolean,
        ban_ui?: boolean,
        vi_tri_id?: number,
    ): Promise<phongDTO | null> {
        try {
            const room = await this.prisma.phong.findFirst({
                where: { id: id },
            });
            if (!room) {
                throw new NotFoundException(`Không tìm thấy room id: ${id}`);
            }
            const dataToUpdate: Partial<phongDTO> = {
                ten_phong: ten_phong !== undefined ? ten_phong : room.ten_phong,
                khach: khach !== undefined ? khach : room.khach,
                phong_ngu: phong_ngu !== undefined ? phong_ngu : room.phong_ngu,
                giuong: giuong !== undefined ? giuong : room.giuong,
                phong_tam: phong_tam !== undefined ? phong_tam : room.phong_tam,
                mo_ta: mo_ta !== undefined ? mo_ta : room.mo_ta,
                gia_tien: gia_tien !== undefined ? gia_tien : room.gia_tien,
                may_giat: may_giat !== undefined ? may_giat : room.may_giat,
                ban_la: ban_la !== undefined ? ban_la : room.ban_la,
                tivi: tivi !== undefined ? tivi : room.tivi,
                dieu_hoa: dieu_hoa !== undefined ? dieu_hoa : room.dieu_hoa,
                wifi: wifi !== undefined ? wifi : room.wifi,
                bep: bep !== undefined ? bep : room.bep,
                do_xe: do_xe !== undefined ? do_xe : room.do_xe,
                ho_boi: ho_boi !== undefined ? ho_boi : room.ho_boi,
                ban_ui: ban_ui !== undefined ? ban_ui : room.ban_ui,
                vi_tri_id: vi_tri_id !== undefined ? vi_tri_id : room.vi_tri_id,
            };
            Object.keys(dataToUpdate).forEach((key) => {
                if (
                    typeof dataToUpdate[key] === "number" &&
                    isNaN(dataToUpdate[key])
                ) {
                    dataToUpdate[key] = room[key];
                }
            });
            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedRoom = await this.prisma.phong.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(phongDTO, updatedRoom);
        } catch (error) {
            throw new Error(error)
        }
    }

    async uploadAnh(
        id: number,
        anh: string
    ): Promise<phongDTO> {
        try {
            const room = await this.prisma.phong.findFirst({
                where: { id: id }
            });
            if (!room) {
                throw new NotFoundException(`Không tìm thấy phòng id: ${id}`);
            }
            const updatedRoom = await this.prisma.phong.update({
                where: { id },
                data: {
                    hinh_anh: anh
                },
            });
            return plainToClass(phongDTO, updatedRoom);
        } catch (error) {
            throw new Error(error)
        }
    }

    async remove(id: number): Promise<string> {
        try {
            const room = await this.prisma.phong.findFirst({
                where: { id: id }
            });
            if (!room) {
                throw new NotFoundException(`Không tìm thấy room id: ${id}`);
            }
            await this.prisma.phong.delete({
                where: { id: id }
            })
            return "Xóa thành công"
        } catch (error) {
            throw new Error(error)
        }
    }


}
