import * as bycrpt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { envs } from '../core/envs';
dotenv.config();
const JWT_SECRET = envs.JWT_SECRET;
interface payload {
	id: number;
}
export class Encrypt {
	static async passwordEncrypt(pass: string): Promise<string> {
		return bycrpt.hashSync(pass, 10);
	}

	static async comparePass(pass: string, hash: string): Promise<boolean> {
		return bycrpt.compareSync(pass, hash);
	}

	static async generateToken(payload: payload): Promise<string> {
		return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
	}
}
