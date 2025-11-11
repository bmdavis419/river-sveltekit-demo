<script lang="ts">
	import { goto } from '$app/navigation';
	import { remoteCheckAuthStatus } from '$lib/auth/remote.auth';

	const { isAuthenticated } = await remoteCheckAuthStatus();

	if (!isAuthenticated) {
		goto('/');
	}
</script>

<div>basic demo</div>
