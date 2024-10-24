import {BadRequestException, Body, Controller, Get, Headers, Inject, Post} from '@nestjs/common';
import {Encryption} from "./encrypt/encryption";
import {User} from "./user.decorator";
import {AppRepo} from "./app.repo";
import {ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags} from "@nestjs/swagger";
import {AppDecryptDto, AppEncryptDto} from "./app.dto";

@ApiTags('Test')
@Controller('')
export class AppController {
    @Inject() private readonly appRepo: AppRepo

    @Get('/public-key')
    async getKey(@User() user: any) {
        try {
            let encryption = new Encryption(this.appRepo)
            let data = await encryption.getInitiatorSecret(user)
            return {message: "ok", public_key: data.public_key}
        } catch (e) {
            console.log('e', e)
            throw new BadRequestException('Get key error')

        }
    }

    @ApiBearerAuth('public_key')
    @ApiBody({type: AppDecryptDto})
    @Post('/decrypt')
    async decrypt(@Body() data: AppDecryptDto, @Headers('public_key') public_key) {
        let encryption = new Encryption(this.appRepo);
        try {
            return await encryption.decryptPayload(public_key, data)
        } catch (e) {
            throw new BadRequestException('Decrypt error invalid key');
        }
    }

    @ApiBasicAuth('public_key')
    @ApiBody({type: AppEncryptDto})
    @Post('/encrypt')
    async encrypt(@Body() payload: AppEncryptDto, @Headers('public_key') public_key) {
        let encryption = new Encryption(this.appRepo);
        return await encryption.encryptPayload(public_key, payload)
    }
}
