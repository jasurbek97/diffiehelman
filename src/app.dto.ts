import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class AppDecryptDto {
    @ApiProperty({default: 'ade6894272aafa01e819cc17e04365b8fc686f092262bfce68a5b1d54fecf0fa|d453aeed0410ed1d1c2681148754e0e3'})
    @IsDefined()
    @IsString()
    payload: string;

    @ApiProperty({default: 'cLIgVvBQsqMcK1jOPgBDOw=='})
    @IsDefined()
    @IsString()
    salt: string;
}

export class AppEncryptDto {
    @ApiProperty({
        default: {
            "title": "encrypt example",
            "desc": "You'll send this content to decrypt method"
        }
    })
    @IsDefined()
    @IsString()
    payload: string;
}