import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class viTriDTO {
    @Expose()
    id: number

    @IsNotEmpty({ message: "Tên vị trí không được để trống" })
    @ApiProperty({ description: "Tên vị trí" })
    @Expose()
    ten_vi_tri: string

    @IsNotEmpty({ message: "Tỉnh thành không được để trống" })
    @ApiProperty({ description: "Tên tỉnh thành" })
    @Expose()
    tinh_thanh: string

    @IsNotEmpty({ message: "Quốc gia không được để trống" })
    @ApiProperty({ description: "Quốc gia" })
    @Expose()
    quoc_gia: string

    @Expose()
    hinh_anh: string

    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}