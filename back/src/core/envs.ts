import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('').asString(),
	ADMIN_USER: get('ADMIN_USER').default('admin@admin.com').asString(),
	JWT_SECRET: get('JWT_SECRET').default('default_secret').asString()
};
