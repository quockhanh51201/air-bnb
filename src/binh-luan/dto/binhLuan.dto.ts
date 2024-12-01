import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class binhLuanDTO {
    @Expose()
    id: number

    @IsNotEmpty({ message: "Mã công việc được để trống" })
    @ApiProperty({ description: "Mã công việc" })
    @Expose()
    ma_cong_viec: number

    @IsNotEmpty({ message: "Mã người bình luận không được để trống" })
    @ApiProperty({ description: "Mã người bình luận " })
    @Expose()
    ma_nguoi_binh_luan: number

    @IsNotEmpty({ message: "Ngày bình luận không được để trống" })
    @ApiProperty({ description: "Ngày bình luận" })
    @Expose()
    ngay_binh_luan: string

    @IsNotEmpty({ message: "Nội dung không được để trống" })
    @ApiProperty({ description: "Nội dung" })
    @Expose()
    noi_dung: string

    @IsNotEmpty({ message: "Số sao không được để trống" })
    @ApiProperty({ description: "Số sao" })
    @Expose()
    sao_binh_luan: number

    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}