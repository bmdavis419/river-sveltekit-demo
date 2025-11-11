import { command, getRequestEvent, query } from '$app/server';
import { env } from '$env/dynamic/private';
import z from 'zod';
import { checkAuthStatus } from '.';

export const remoteCheckAuthStatus = query(async () => {
	const event = getRequestEvent();

	const { isAuthenticated } = checkAuthStatus(event);

	return {
		isAuthenticated
	};
});

export const remoteSignOut = command(async () => {
	const { cookies } = getRequestEvent();

	cookies.delete('user-saved-password', {
		path: '/'
	});

	return {
		success: true
	};
});

export const remoteSignIn = command(
	z.object({
		password: z.string()
	}),
	async ({ password }) => {
		if (password !== env.SECRET_APP_PASSWORD) {
			return {
				success: false,
				error: 'Invalid password'
			};
		}

		const { cookies } = getRequestEvent();

		cookies.set('user-saved-password', password, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		return {
			success: true
		};
	}
);
