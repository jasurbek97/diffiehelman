import {BinaryLike, CipherGCM, createCipheriv, createDecipheriv, DecipherGCM, randomBytes, scryptSync} from "crypto";

export class AES256GCMEncryptor {
    algorithm: string;
    key: Buffer;

    constructor(encryptionKey: BinaryLike, salt: string) {
        this.algorithm = "aes-256-gcm";
        this.key = scryptSync(encryptionKey, salt, 32); // 256-bit key requires 32 bytes
    }

    encrypt(clearText: string): string {
        const iv = randomBytes(12); // GCM mode typically uses a 12-byte IV
        const cipher = createCipheriv(this.algorithm, this.key, iv) as CipherGCM;
        const encrypted = cipher.update(clearText, "utf8", "hex");
        const finalEncrypted = encrypted + cipher.final("hex");
        const authTag = cipher.getAuthTag().toString('hex'); // GCM mode produces an authentication tag
        return [
            finalEncrypted,
            Buffer.from(iv).toString("hex"),
            authTag
        ].join("|");
    }

    decrypt(encryptedText: string): string {
        const [encrypted, iv, authTag] = encryptedText.split("|");
        if (!iv || !authTag) throw new Error("IV or AuthTag not found");
        const decipher = createDecipheriv(this.algorithm, this.key, Buffer.from(iv, "hex")) as DecipherGCM;
        decipher.setAuthTag(Buffer.from(authTag, "hex")); // Set the authentication tag
        const decrypted = decipher.update(encrypted, "hex", "utf8");
        return decrypted + decipher.final("utf8");
    }
}
