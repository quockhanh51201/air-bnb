import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class phongDTO {
    @Expose()
    id: number

    @IsNotEmpty({ message: "Tên phòng không được để trống" })
    @ApiProperty({ description: "Tên phòng" })
    @Expose()
    ten_phong: string

    @IsNotEmpty({ message: "Số lượng khách không được để trống" })
    @ApiProperty({ description: "Số lượng khách" })
    @Expose()
    khach: number

    @IsNotEmpty({ message: "Số lượng phòng ngủ không được để trống" })
    @ApiProperty({ description: "Số lượng phòng ngủ" })
    @Expose()
    phong_ngu: number

    @IsNotEmpty({ message: "Số giường không được để trống" })
    @ApiProperty({ description: "Số giường" })
    @Expose()
    giuong: number

    @IsNotEmpty({ message: "Số phòng tắm không được để trống" })
    @ApiProperty({ description: "Số phòng tắm" })
    @Expose()
    phong_tam: number

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    @ApiProperty({ description: "Mô tả" })
    @Expose()
    mo_ta: string

    @IsNotEmpty({ message: "Giá tiền không được để trống" })
    @ApiProperty({ description: "Giá tiền" })
    @Expose()
    gia_tien: number

    @IsNotEmpty({ message: "Máy giặt không được để trống" })
    @ApiProperty({ description: "Máy giặt" })
    @Expose()
    may_giat: boolean

    @IsNotEmpty({ message: "Bàn là không được để trống" })
    @ApiProperty({ description: "Bàn là" })
    @Expose()
    ban_la: boolean

    @IsNotEmpty({ message: "Ti vi không được để trống" })
    @ApiProperty({ description: "Ti vi" })
    @Expose()
    tivi: boolean

    @IsNotEmpty({ message: "Điều hòa không được để trống" })
    @ApiProperty({ description: "Điều hòa" })
    @Expose()
    dieu_hoa: boolean

    @IsNotEmpty({ message: "Wifi không được để trống" })
    @ApiProperty({ description: "Wifi" })
    @Expose()
    wifi: boolean

    @IsNotEmpty({ message: "Bếp không được để trống" })
    @ApiProperty({ description: "Bếp" })
    @Expose()
    bep: boolean

    @IsNotEmpty({ message: "Đỗ xe không được để trống" })
    @ApiProperty({ description: "Đỗ xe" })
    @Expose()
    do_xe: boolean

    @IsNotEmpty({ message: "Hồ bơi không được để trống" })
    @ApiProperty({ description: "Hồ bơi" })
    @Expose()
    ho_boi: boolean

    @IsNotEmpty({ message: "Bàn ủi không được để trống" })
    @ApiProperty({ description: "Bàn ủi" })
    @Expose()
    ban_ui: boolean

    @IsNotEmpty({ message: "Vị trí (id vị trí) không được để trống" })
    @ApiProperty({ description: "Bàn ủi" })
    @Expose()
    vi_tri_id: number

    @Expose()
    hinh_anh: string


    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}