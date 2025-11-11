import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

export const checkAuthStatus = (event: RequestEvent) => {
	const { cookies } = event;

	const userSavedPassword = cookies.get('user-saved-password');

	if (!userSavedPassword) {
		return {
			isAuthenticated: false
		};
	}

	const isAuthenticated = userSavedPassword === env.SECRET_APP_PASSWORD;

	return {
		isAuthenticated
	};
};
