import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDTO {

    @IsNotEmpty({ message: "Họ tên không được để trống" })
    @ApiProperty({ description: "Họ tên của người dùng" })
    name: string;

    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: "Email không được để trống" })
    @ApiProperty({ description: "Địa chỉ email của người dùng" })
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    @ApiProperty({ description: "Mật khẩu của người dùng" })
    password: string;

    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    @ApiProperty({ description: "Số điện thoại của người dùng" })
    phone: string;

    @IsNotEmpty({ message: "Năm sinh không được để trống" })
    @ApiProperty({ description: "Năm sinh" })
    birth_day: string;

    @IsNotEmpty({ message: "Giới tính không được để trống" })
    @ApiProperty({ description: "Giới tính" })
    gender: string;

}

