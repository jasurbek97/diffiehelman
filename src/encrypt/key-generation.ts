import {createDiffieHellman, DiffieHellman} from "crypto";
export class KeyGeneration {
    private initiator!: DiffieHellman;
    private recipient!: DiffieHellman;

    initiatorKey(): { key: string; prime: string; generator: string } {
        const first = createDiffieHellman(512);
        this.initiator = first;
        const key = first.generateKeys("base64");
        const prime = first.getPrime("base64");
        const generator = first.getGenerator("base64");
        return {
            key,
            prime,
            generator
        };
    }

    recipientKey(prime: string, generator: string): string {
        const second = createDiffieHellman(
            Buffer.from(prime, "base64"),
            Buffer.from(generator, "base64")
        );
        this.recipient = second;
        return second.generateKeys("base64");
    }

    initiatorSecret(recipientKey: string): string {
        return this.initiator.computeSecret(
            recipientKey,
            "base64",
            "base64"
        );
    }

    recipientSecret(initiatorKey: string): string {
        return this.recipient.computeSecret(
            initiatorKey,
            "base64",
            "base64"
        );
    }
}

