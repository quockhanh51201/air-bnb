import { Module } from "@nestjs/common";
import { CloudUploadService } from "./cloudUpload.service";
import { CloudinaryModule } from "src/cloudinary/cloudinaty.module";

@Module({
    imports: [CloudinaryModule],
    providers: [CloudUploadService],
    exports: [CloudUploadService]
})
export class ShareModule { }