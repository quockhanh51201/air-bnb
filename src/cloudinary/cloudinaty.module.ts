import { Module } from "@nestjs/common";
import { cloudinaryConfig } from "./cloudinaty.config";
import { CloudinaryProvider } from "./cloudinaty.provider";

@Module({
    providers: [cloudinaryConfig, CloudinaryProvider],
    exports: [CloudinaryProvider]
})
export class CloudinaryModule { }