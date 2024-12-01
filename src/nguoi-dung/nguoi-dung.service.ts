import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { nguoiDungDTO } from './dto/nguoidung.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class NguoiDungService {
    prisma = new PrismaClient()
    async getUser(user_id: Number): Promise<nguoiDungDTO> {
        try {
            let user = await this.prisma.nguoiDung.findFirst({
                where: ({ id: Number(user_id) })
            })
            return plainToClass(nguoiDungDTO, user)
        } catch (error) {
            throw new Error(error)
        }
    }
    async findAll(
        page: number, size: number, keyword: string
    ): Promise<nguoiDungDTO[]> {
        try {
            let users = await this.prisma.nguoiDung.findMany({
                where: keyword
                    ? {
                        name: {
                            contains: keyword
                        }
                    }
                    : {},
                skip: (page - 1) * size,
                take: size
            })
            return users.map(user => plainToClass(nguoiDungDTO, user))
        } catch (error) {
            throw new Error(error)
        }
    }
    async remove(id: number): Promise<string> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { id: id },
            });
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng id: ${id}`);
            }
            await this.prisma.nguoiDung.delete({ where: { id: id } })
            return "Xóa thành công"
        } catch (error) {
            throw new Error(error)
        }
    }

    async findOne(id: number): Promise<nguoiDungDTO | null> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { id: id },
            });

            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng id: ${id}`);
            }
            return plainToClass(nguoiDungDTO, user);
        } catch (error) {
            throw new Error(error)
        }
    }

    async findOneByName(name: string): Promise<nguoiDungDTO[] | null> {
        try {
            const user = await this.prisma.nguoiDung.findMany({
                where: {
                    name: {
                        contains: name
                    }
                },
            });

            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng có tên: ${name}`);
            }
            return plainToClass(nguoiDungDTO, user);
        } catch (error) {
            throw new Error(error)
        }
    }

    async update(
        id: number,
        name: string,
        phone: string,
        birthday: string,
        gender: string
    ): Promise<nguoiDungDTO | null> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { id: id },
            });
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng id: ${id}`);
            }
            const dataToUpdate: Partial<nguoiDungDTO> = {}
            if (name !== undefined) dataToUpdate.name = name;
            if (phone !== undefined) dataToUpdate.phone = phone;
            if (birthday !== undefined) dataToUpdate.birth_day = birthday;
            if (gender !== undefined) dataToUpdate.gender = gender;

            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedUser = await this.prisma.nguoiDung.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(nguoiDungDTO, updatedUser);
        } catch (error) {
            throw new Error(error)
        }
    }

    async uploadAvatar(
        id: number,
        avt: string
    ): Promise<nguoiDungDTO> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { id: id }
            });
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng id: ${id}`);
            }

            const updatedUser = await this.prisma.nguoiDung.update({
                where: { id },
                data: {
                    avatar: avt
                },
            });
            return plainToClass(nguoiDungDTO, updatedUser);
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateRole(
        id: number,
        name: string,
        phone: string,
        birthday: string,
        gender: string,
        role: string
    ): Promise<nguoiDungDTO | null> {
        try {
            const user = await this.prisma.nguoiDung.findFirst({
                where: { id: id },
            });
            if (!user) {
                throw new NotFoundException(`Không tìm thấy người dùng id: ${id}`);
            }
            const dataToUpdate: Partial<nguoiDungDTO> = {}
            if (name !== undefined) dataToUpdate.name = name;
            if (phone !== undefined) dataToUpdate.phone = phone;
            if (birthday !== undefined) dataToUpdate.birth_day = birthday;
            if (gender !== undefined) dataToUpdate.gender = gender;
            if (role !== undefined) dataToUpdate.role = role;
            const plainDataToUpdate = plainToClass(Object, dataToUpdate);

            const updatedUser = await this.prisma.nguoiDung.update({
                where: { id },
                data: plainDataToUpdate,
            });
            return plainToClass(nguoiDungDTO, updatedUser);
        } catch (error) {
            throw new Error(error)
        }
    }
}
