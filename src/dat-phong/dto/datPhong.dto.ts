import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class datPhongDTO {
    @Expose()
    id: number

    @IsNotEmpty({ message: "Mã phòng không được để trống" })
    @ApiProperty({ description: "Mã phòng" })
    @Expose()
    ma_phong: number

    @IsNotEmpty({ message: "Ngày đến không được để trống" })
    @ApiProperty({ description: "Ngày đến" })
    @Expose()
    ngay_den: string

    @IsNotEmpty({ message: "Ngày đi không được để trống" })
    @ApiProperty({ description: "Ngày đi" })
    @Expose()
    ngay_di: string

    @IsNotEmpty({ message: "Số lượng khách không được để trống" })
    @ApiProperty({ description: "Số lượng khách" })
    @Expose()
    so_luong_khach: number

    @IsNotEmpty({ message: "Mã người đặt không được để trống" })
    @ApiProperty({ description: "Mã người đặt " })
    @Expose()
    ma_nguoi_dat: number


    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}