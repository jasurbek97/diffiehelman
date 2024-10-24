import {Injectable} from "@nestjs/common";
import * as fs from "fs";
import * as path from 'path';
@Injectable()
export class AppRepo {
    path = 'data.json';

    async set(key: string, value: string) {
        const full_path = path.resolve(this.path);
        if (!fs.existsSync(full_path)) {
            fs.writeFileSync(full_path, JSON.stringify({}, null, 2), 'utf-8');
        }
        const content = fs.readFileSync(full_path, 'utf-8');
        const data = JSON.parse(content)
        if (typeof data === "object") {
            data[key] = value;
        }
        fs.writeFileSync(full_path, JSON.stringify(data, null, 2), 'utf-8')
        return true
    }

    async get(key: string) {
        const full_path = path.resolve(this.path);
        const content = fs.readFileSync(full_path, 'utf-8')
        const data = JSON.parse(content)
        if (typeof data === "object") {
            return data[key] || null;
        }
        return null;
    }

}