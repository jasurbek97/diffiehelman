import {BinaryLike, createCipheriv, createDecipheriv, randomBytes, scryptSync} from "crypto";

export class AES256CBCEncryptor {
    algorithm: string;
    key: Buffer;

    constructor(encryptionKey: BinaryLike, salt: string) {
        this.algorithm = "aes-256-cbc";
        this.key = scryptSync(encryptionKey, salt, 32); // 256-bit key requires 32 bytes
    }

    encrypt(clearText: string): string {
        const iv = randomBytes(16); // CBC mode requires a 16-byte IV
        const cipher = createCipheriv(this.algorithm, this.key, iv);
        const encrypted = cipher.update(clearText, "utf8", "hex");
        return [
            encrypted + cipher.final("hex"),
            Buffer.from(iv).toString("hex")
        ].join("|");
    }

    decrypt(encryptedText: string): string {
        const [encrypted, iv] = encryptedText.split("|");
        if (!iv) throw new Error("IV not found");
        const decipher = createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(iv, "hex")
        );
        return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    }
}
