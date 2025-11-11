import { checkAuthStatus } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load = (event) => {
	const { isAuthenticated } = checkAuthStatus(event);

	if (!isAuthenticated) {
		redirect(302, '/');
	}

	return {
		isAuthenticated
	};
};
