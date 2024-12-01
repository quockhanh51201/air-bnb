import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    prisma = new PrismaClient()
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }


    async login(body: LoginDTO): Promise<string> {
        try {
            const { email, password } = body
            const checkUser = await this.prisma.nguoiDung.findFirst({
                where: { email }
            })
            if (!checkUser) {
                throw new BadRequestException("Email is wrong")
            }
            const checkPass = bcrypt.compareSync(password, checkUser.pass_word)
            if (!checkPass) {
                throw new BadRequestException("Password is wrong")
            }
            const token = this.jwtService.sign(
                { data: { user_id: checkUser.id } },
                {
                    expiresIn: "30m",
                    algorithm: 'HS256',
                    privateKey: this.configService.get<string>('SECRET_KEY')
                }
            )
            return token
        } catch (error) {
            throw new Error(error)
        }
    }


    async register(body: RegisterDTO): Promise<string> {
        try {
            const { name, email, password, phone, birth_day, gender } = body
            const userExist = await this.prisma.nguoiDung.findFirst({
                where: { email }
            })
            if (userExist) {
                return "Tài khoản đã tồn tại"
            }
            let userNew = await this.prisma.nguoiDung.create({
                data: {
                    name: name,
                    email: email,
                    pass_word: bcrypt.hashSync(password, 10),
                    birth_day: birth_day,
                    phone: phone,
                    gender: gender
                }
            })
            return "Đăng kí tài khoản thành công !"
        } catch (error) {
            throw new Error(error)
        }
    }
    // async updateAvt(id: number, img: string) {
    //     try {
    //         const updatedUser = await this.prisma.nguoiDung.update({
    //             where: { nguoi: id },
    //             data: { anh_dai_dien: img },
    //         });
    //         return "Cập nhật ảnh đại diện thành công !"
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }
}
