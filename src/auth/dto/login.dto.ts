import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDTO {

    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: "Email không được để trống" })
    @ApiProperty({
        description: "Địa chỉ email của người dùng, cần phải là một email hợp lệ.",
        example: "quockhanh51201@gmail.com"
    })
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    @ApiProperty({
        description: "Mật khẩu của người dùng, phải có ít nhất một ký tự.",
        example: "123456"
    })
    password: string;
}
