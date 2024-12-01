import { Exclude, Expose } from "class-transformer";

export class nguoiDungDTO {
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    email: string

    @Exclude()
    pass_word: string

    @Expose()
    phone: string

    @Expose()
    birth_day: string

    @Expose()
    gender: string

    @Expose()
    role: string

    @Expose()
    avatar: string


    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}