import {randomBytes} from "crypto";
import {Encryptor} from "./encryptor";
import {AppRepo} from "../app.repo";
import {KeyGeneration} from "./key-generation";


export class Encryption {
    private keyGeneration: KeyGeneration;

    constructor(private readonly appRepo: AppRepo) {
        this.keyGeneration = new KeyGeneration();
    }

    async getInitiatorSecret(user?: any) {
        const keyDetails = this.keyGeneration.initiatorKey();
        const {key, prime, generator} = keyDetails;
        let data = await this.recipientKeys(prime, generator, key)
        await this.appRepo.set('token-owner$' + user.id, data.public_key) /// optional todo get token owner
        const secret_key = this.keyGeneration.initiatorSecret(data.public_key);
        await this.appRepo.set(data.public_key, secret_key);
        return {public_key: key};
    }

    async recipientKeys(
        prime: string,
        generator: string,
        key: string
    ): Promise<{ public_key: string; secret_key: string }> {
        const public_key = this.keyGeneration.recipientKey(prime, generator);
        const secret_key = this.keyGeneration.recipientSecret(key);
        await this.appRepo.set(key, secret_key);
        return {public_key, secret_key};
    }

    async decryptPayload(
        cuepriseHeader: string,
        data: { payload: string; salt: string }
    ) {
        const secretKey = await this.appRepo.get(cuepriseHeader);
        if (!secretKey) {
            throw new Error("Invalid header value");
        }
        const encryption = new Encryptor(secretKey, data.salt);
        return JSON.parse(encryption.decrypt(data.payload));
    }

    async encryptPayload(cuepriseHeader: string, payload: object) {
        const salt = randomBytes(16).toString("base64");
        const secretKey = await this.appRepo.get(cuepriseHeader);
        if (!secretKey) {
            throw new Error("Invalid header value");
        }
        const encryption = new Encryptor(secretKey, salt);
        return {payload: encryption.encrypt(JSON.stringify(payload)), salt};
    }
}
