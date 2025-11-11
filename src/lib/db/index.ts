import { env } from '$env/dynamic/private';
import Redis from 'ioredis';

const globalForDb = globalThis as unknown as {
	redisClient: Redis | undefined;
};

const getClient = () => {
	if (!globalForDb.redisClient) {
		globalForDb.redisClient = new Redis(env.REDIS_URL);
	}

	return globalForDb.redisClient;
};

export const redisClient = new Proxy({} as Redis, {
	get: (_, prop) => {
		const client = getClient();
		return client[prop as keyof Redis];
	}
});
